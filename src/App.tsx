import React, { useEffect, useState } from "react";

function App() {
  const [words, setWords] = useState({
    prevWords: "",
    currentLetter: "",
    nextWords: "",
  });

  const handleKeyPress = (key: string) => {
    if (key === words.currentLetter) {
      setWords({
        prevWords: words.prevWords + words.currentLetter,
        currentLetter: words.nextWords.substring(0, 1),
        nextWords: words.nextWords.substr(1),
      });
    }
  };

  useEffect(() => {
    setWords({
      prevWords: "that they ",
      currentLetter: "e",
      nextWords:
        "arly before change long around group you increase eye line against same give turn large where right late more too line place of what school show long or point around plan turn before from people interest course own he write problem too begin change to early give more",
    });
    // fetch(
    //   "https://popular-words-api.herokuapp.com/api/words/list?minrank=1&maxrank=1000"
    // )
    //   .then((res) => res.json())
    //   .then((data) => console.log(data));
  }, []);

  return (
    <div
      className="w-screen h-screen bg-gray-600 flex items-center justify-center"
      tabIndex={0}
      onKeyDown={(e) => handleKeyPress(e.key)}
    >
      <div className="w-3/4 bg-gray-600">
        <div className="text-pink-400 inline">{words.prevWords}</div>
        <div className="text-white inline">{words.currentLetter}</div>
        <div className="text-white inline">{words.nextWords}</div>
      </div>
    </div>
  );
}

export default App;
