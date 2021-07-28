import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function App() {
  const [words, setWords] = useState({
    prevString: "",
    currentString: "",
    nextString: "",
  });

  const [inputWrong, setInputWrong] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
        // if you're just trying to erase a correct key
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

  useEffect(() => {
    fetch(
      "https://popular-words-api.herokuapp.com/api/words/randomlist?size=50&minrank=1&maxrank=500"
    )
      .then((res) => res.json())
      .then((data) => {
        data = data.join(" ");
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
      {(words.nextString || words.prevString) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-3/4 max-w-4xl text-justify bg-gray-800 rounded-lg p-5"
        >
          <div className="text-blue-400 inline">{words.prevString}</div>
          <motion.div
            layout
            transition={{ type: "tween", duration: 0.075 }}
            className="text-green-300 inline absolute text-xl -mx-1 -my-1 animate-pulse"
          >
            |
          </motion.div>
          <div
            className={`${inputWrong ? "text-red-400" : "text-white"} inline`}
          >
            {/*inputWrong ? inputWrong : */ words.currentString}
          </div>
          <div className="text-white inline">{words.nextString}</div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
