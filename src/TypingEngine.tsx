import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WatchDirectoryFlags } from "typescript";

type EngineProps = {
  inputWrong: string;
  words: {
    prevString: string;
    currentString: string;
    nextString: string;
  };
  wordArray: string[];
};

const TypingEngine = ({ inputWrong, words, wordArray }: EngineProps) => {
  const nextWordsRef = useRef<HTMLDivElement>(null);

  const [newWords, setNewWords] = useState({
    prevString: "", // previously typed out letters
    currentString: "", // current letters you need to type, for input matching
    nextString: "", // next letters you need to type
  });

  
  useEffect(() => {
    var i = 1;
    while (nextWordsRef.current!.getClientRects().length < 4) {
      setNewWords({
        ...newWords,
        nextString: wordArray.slice(0, i).join(" "),
      });
      i = i + 1;
    }
  }, [nextWordsRef.current]);



  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`w-full text-justify font-ubuntu text-lg bg-gray-800 rounded-lg p-5`}
    >
      <div className="text-darcula-purple inline">{newWords.prevString}</div>
      <motion.div
        layout
        transition={{ type: "tween", duration: 0.075 }}
        className="text-green-300 inline absolute text-xl mx-cursor"
      >
        <motion.div
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.001 }}
        >
          |
        </motion.div>
      </motion.div>
      <div className={`${inputWrong ? "text-red-400" : "text-white"} inline`}>
        {/*inputWrong ? inputWrong : */ newWords.currentString}
      </div>
      <div className="text-white inline" ref={nextWordsRef}>
        {newWords.nextString}
      </div>
    </motion.div>
  );
};

export default TypingEngine;
