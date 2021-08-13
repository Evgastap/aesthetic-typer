import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Timer from "./Timer";
import { useTimer } from "react-timer-hook";
import Dashboard from "./Dashboard";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { TOTAL_SECONDS } from "./Constants";
import Cursor from "./atoms/Cursor";
import CorrectWords from "./atoms/CorrectWords";
import IncorrectWords from "./atoms/IncorrectWords";
import RemainingWords from "./atoms/RemainingWords";
import ProgressBar from "./atoms/ProgressBar";

const App = () => {
  // state for the words you need to type
  const [words, setWords] = useState({
    prevString: "", // previously typed out letters
    currentString: "", // current letters you need to type, for input matching
    nextString: "", // next letters you need to type
  });

  // state for storing incorrect input
  // todo: move to words state
  const [inputWrong, setInputWrong] = useState("");

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
        newWordsTyped[currentTime] += 1;
        setStats({ ...stats, wordsTyped: newWordsTyped });
    }
  };

  // function to restart the typing test
  const restartTest = () => {
    if (appState === "summary") fetchWords();
    setStats(initialStats);
    setInputWrong("");
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
    if (key === words.currentString && !inputWrong) {
      // input is correct
      setInputWrong("");
      setWords({
        prevString: words.prevString + words.currentString,
        currentString: words.nextString.substring(0, 1),
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
      if (inputWrong) {
        // if there's already a string of wrong pressed keys
        setInputWrong(inputWrong.substr(0, inputWrong.length - 1));
        setWords({
          ...words,
          prevString: words.prevString,
          // prevents current string from becoming empty
          currentString: words.currentString.substring(
            0,
            Math.max(words.currentString.length - 1, 1)
          ),
          nextString:
            inputWrong.length === 1
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
      const firstMistake = inputWrong.length === 0;
      setWords({
        ...words,
        prevString: words.prevString,
        currentString: firstMistake
          ? words.currentString
          : words.currentString + words.nextString.substring(0, 1),
        nextString: firstMistake
          ? words.nextString
          : words.nextString.substr(1),
      });
      setInputWrong(inputWrong + key);
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

  return (
    // parent div
    <div
      className="w-screen h-screen bg-gray-700 flex items-center justify-center flex-col text-lg"
      tabIndex={0}
      onKeyDown={(e) => appState !== "summary" && handleKeyPress(e)}
    >
      {appState === "loading" ? (
        // loader for when words are loading
        <ClimbingBoxLoader color={"#BF9FF7"} />
      ) : (
        // parent div with dark background
        <div className="w-3/4 min-h-2 relative max-w-4xl justify-center p-5 bg-gray-800 rounded-lg block overflow-hidden">
          <ProgressBar seconds={seconds} minutes={minutes} />
          {appState === "typing" && (
            // timer of seconds remaining
            <Timer seconds={seconds} minutes={minutes} />
          )}
          {/* div containing the text */}
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full text-justify font-ubuntu max-h-20 overflow-hidden px-1"
          >
            {/* div to scroll text after user types > 2 lines */}
            <motion.div
              animate={{ y: `${-1.75 * Math.max(0, lines.linesTyped - 1)}rem` }}
            >
              <CorrectWords prevString={words.prevString} />
              <Cursor />
              <IncorrectWords currentString={words.currentString} inputWrong={inputWrong} />
              <RemainingWords nextString={words.nextString} nextWordsDivRef={nextWordsDivRef} />
            </motion.div>
          </motion.div>
        </div>
      )}
      {/* summary dashboard for after type test */}
      {appState === "summary" && (
        <Dashboard stats={stats} startTest={restartTest} />
      )}
    </div>
  );
};

export default App;
