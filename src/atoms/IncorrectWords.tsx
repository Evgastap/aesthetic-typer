import React from "react";

type IncorrectWordsProps = {
	currentString: string,
	wrongString: string
}

const IncorrectWords = ({currentString, wrongString}: IncorrectWordsProps) => {
  return (
    /* div for incorrectly typed words */
    <div
      className={`${
        wrongString ? "text-red-400 bg-gray-700" : "text-white"
      } inline`}
    >
      {/*inputWrong ? inputWrong : */ currentString}
    </div>
  );
};

export default IncorrectWords;
