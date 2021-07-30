import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Timer from "./Timer";
import { useTimer } from 'react-timer-hook';

const App = () => {
  // state for the words you need to type
  const [words, setWords] = useState({
    prevString: "", // previously typed out letters
    currentString: "", // current letters you need to type, for input matching
    nextString: "", // next letters you need to type
  });

  // state for storing incorrect input
  const [inputWrong, setInputWrong] = useState("");

  // useTimer hook for tracking time spent typing
  const expiryTimestamp = new Date().getTime();
  const {
    seconds,
    minutes,
    isRunning,
    restart
  } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  // function to handle key presses
  const handleKeyPress = (e: React.KeyboardEvent) => {
    // start the timer if hasn't started yet
    if (!isRunning) {
      const time = new Date();
      time.setSeconds(time.getSeconds() + 60);
      restart(time.getTime());
     }

    const key = e.key;
    if (key === words.currentString && !inputWrong) {
      // input is correct
      setInputWrong("");
      setWords({
        prevString: words.prevString + words.currentString,
        currentString: words.nextString.substring(0, 1),
        nextString: words.nextString.substr(1),
      });
    } else if (key === "Backspace") {
      // if backspace pressed
      if (inputWrong) {
        // if there's already a string of wrong pressed keys
        setInputWrong(inputWrong.substr(0, inputWrong.length - 1));
        setWords({
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
      } else {
        // if user is just trying to erase a correct key
        setWords({
          prevString: words.prevString.substring(
            0,
            words.prevString.length - 1
          ),
          currentString: words.prevString.substr(-1),
          nextString: words.currentString + words.nextString,
        });
      }
    } else if (key.match("^[a-zA-Z]$")) {
      // if the key pressed is incorrect
      const firstMistake = inputWrong.length === 0;
      setWords({
        prevString: words.prevString,
        currentString: firstMistake
          ? words.currentString
          : words.currentString + words.nextString.substring(0, 1),
        nextString: firstMistake
          ? words.nextString
          : words.nextString.substr(1),
      });
      setInputWrong(inputWrong + key);
    }
  };

  // useEffect to fetch random words on reload and set state
  useEffect(() => {
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
      });
  }, []);

  return (
    <div
      className="w-screen h-screen bg-gray-700 flex items-center justify-center"
      tabIndex={0}
      onKeyDown={(e) => handleKeyPress(e)}
    >
      <div className="w-3/4 relative block max-w-4xl">
        {isRunning && words.prevString && <Timer seconds={seconds} minutes={minutes} />}
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`w-full text-justify font-mono bg-gray-800 rounded-lg p-5 ${!words.nextString && "animate-pulse"}`}
        >
          {(words.nextString || words.prevString) && (
            <>
              <div className="text-blue-400 inline">{words.prevString}</div>
              <motion.div
                layout
                transition={{ type: "tween", duration: 0.075 }}
                className="text-green-300 inline absolute text-xl -mx-1 -my-1"
              >
                <motion.div
                  animate={{ opacity: [0, 1] }}
                  transition={{ duration: 0.001 }}
                >
                  |
                </motion.div>
              </motion.div>
              <div
                className={`${
                  inputWrong ? "text-red-400" : "text-white"
                } inline`}
              >
                {/*inputWrong ? inputWrong : */ words.currentString}
              </div>
              <div className="text-white inline">{words.nextString}</div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default App;
