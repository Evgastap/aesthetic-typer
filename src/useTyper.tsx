import { useState, useEffect, useRef } from "react";
import { TOTAL_SECONDS } from "./Constants";
import { useTimer } from "react-timer-hook";

const useTyper = () => {
  // state for the words you need to type
  const [words, setWords] = useState({
    prevString: "", // previously typed out letters
    currentString: "", // current letters you need to type, for input matching
    wrongString: "", // wrongly typed letters
    nextString: "", // next letters you need to type
  });

  // useTimer hook for tracking time spent typing
  const expiryTimestamp = new Date().getTime();
  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => appState === "typing" && setAppState("summary"),
  });

  // app states, either idling before typing test, in progress, or on summary page
  type appStateTypes = "loading" | "idle" | "typing" | "summary";
  const [appState, setAppState] = useState<appStateTypes>("loading");

  // statistics for the current session
  const initialStats = {
    correctKeystrokes: new Array(TOTAL_SECONDS).fill(0),
    incorrectKeystrokes: new Array(TOTAL_SECONDS).fill(0),
    backspaceKeystrokes: new Array(TOTAL_SECONDS).fill(0),
    wordsTyped: new Array(TOTAL_SECONDS).fill(0),
  };

  // state for tracking statistics
  const [stats, setStats] = useState(initialStats);

  // state for tracking how many lines the user has typed
  const [lines, setLines] = useState({ linesTyped: 0, linesRemaining: 0 });

  // function to update the number of correct & incorrect keystrokes
  const updateKeystrokes = (keystroke: string) => {
    const currentTime =
      seconds === 0 && minutes === 0
        ? 0
        : TOTAL_SECONDS - (seconds + minutes * 60);
    switch (keystroke) {
      case "correct":
        const newCorrectKeystrokes = stats.correctKeystrokes;
        newCorrectKeystrokes[currentTime] += 1;
        setStats({ ...stats, correctKeystrokes: newCorrectKeystrokes });
        break;
      case "backspace":
        const newBackspaceKeystrokes = stats.backspaceKeystrokes;
        newBackspaceKeystrokes[currentTime] += 1;
        setStats({ ...stats, backspaceKeystrokes: newBackspaceKeystrokes });
        break;
      case "incorrect":
        const newIncorrectKeystrokes = stats.incorrectKeystrokes;
        newIncorrectKeystrokes[currentTime] += 1;
        setStats({ ...stats, incorrectKeystrokes: newIncorrectKeystrokes });
        break;
      case "space":
        const newWordsTyped = stats.wordsTyped;
        newWordsTyped[currentTime] = words.prevString.split(" ").length;
        setStats({ ...stats, wordsTyped: newWordsTyped });
    }
  };

  // function to restart the typing test
  const restartTest = () => {
    if (appState === "summary") fetchWords();
    setStats(initialStats);
    setLines({ linesTyped: 0, linesRemaining: 0 });
    setAppState("idle");
  };

  // function to start typing test
  const startTest = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + TOTAL_SECONDS);
    restart(time.getTime());
    setAppState("typing");
  };

  // function to return the remaining lines user needs to type
  const getNextDivLines = () => {
    return nextWordsDivRef.current!.getClientRects().length;
  };

  // function to handle key presses
  const handleKeyPress = (e: React.KeyboardEvent) => {
    // start the timer if hasn't started yet
    if (appState === "idle") startTest();

    const key = e.key;
    if (key === words.currentString && !words.wrongString) {
      // input is correct
      setWords({
        prevString: words.prevString + words.currentString,
        currentString: words.nextString.substring(0, 1),
        wrongString: "",
        nextString: words.nextString.substr(1),
      });

      // update number of lines typed
      if (getNextDivLines() !== lines.linesRemaining) {
        setLines({
          linesTyped: lines.linesTyped + 1,
          linesRemaining: lines.linesRemaining - 1,
        });
      }

      // update stats
      updateKeystrokes("correct");
      key === " " && updateKeystrokes("space");
    } else if (key === "Backspace") {
      // if backspace pressed
      if (words.wrongString) {
        // if there's already a string of wrong pressed keys
        setWords({
          ...words,
          prevString: words.prevString,
          // prevents current string from becoming empty
          currentString: words.currentString.substring(
            0,
            Math.max(words.currentString.length - 1, 1)
          ),
          wrongString: words.wrongString.substr(
            0,
            words.wrongString.length - 1
          ),
          nextString:
            words.wrongString.length === 1
              ? words.nextString
              : words.currentString.substr(-1) + words.nextString,
        });
      } else if (words.prevString.length !== 0) {
        // if user is just trying to erase a correct key
        setWords({
          ...words,
          prevString: words.prevString.substring(
            0,
            words.prevString.length - 1
          ),
          currentString: words.prevString.substr(-1),
          nextString: words.currentString + words.nextString,
        });
      }
      updateKeystrokes("backspace");
    } else if (key.match("^[a-zA-Z]$|^ $")) {
      // if the key pressed is incorrect
      const firstMistake = words.wrongString.length === 0;
      setWords({
        ...words,
        prevString: words.prevString,
        currentString: firstMistake
          ? words.currentString
          : words.currentString + words.nextString.substring(0, 1),
        wrongString: words.wrongString + key,
        nextString: firstMistake
          ? words.nextString
          : words.nextString.substr(1),
      });
      updateKeystrokes("incorrect");
    }
  };

  // function to fetch a new set of random words
  const fetchWords = () => {
    fetch("/.netlify/functions/random-words")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.words);
        data = data.words.join(" ");
        setWords({
          prevString: "",
          currentString: data.substring(0, 1),
          wrongString: "",
          nextString: data.substring(1),
        });
        setAppState("idle");
        setLines({ linesTyped: 0, linesRemaining: getNextDivLines() });
      });
  };

  // useEffect to fetch random words on reload and set state
  useEffect(() => {
    fetchWords();
  }, []);

  // ref to the div containing next words; to check for updates to # lines typed
  const nextWordsDivRef = useRef<HTMLDivElement>(null);

  return [
    words,
    stats,
    lines,
    appState,
    { seconds, minutes },
    nextWordsDivRef,
    { restartTest, handleKeyPress },
  ] as const;
};

export default useTyper;
