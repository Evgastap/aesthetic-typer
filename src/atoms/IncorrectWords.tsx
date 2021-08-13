import React from "react";

type IncorrectWordsProps = {
	currentString: string,
	inputWrong: string
}

const IncorrectWords = ({currentString, inputWrong}: IncorrectWordsProps) => {
  return (
    /* div for incorrectly typed words */
    <div
      className={`${
        inputWrong ? "text-red-400 bg-gray-700" : "text-white"
      } inline`}
    >
      {/*inputWrong ? inputWrong : */ currentString}
    </div>
  );
};

export default IncorrectWords;
