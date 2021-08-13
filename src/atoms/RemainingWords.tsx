import { RefObject } from "react";

type RemainingWordsProps = {
	nextString: string,
	nextWordsDivRef: RefObject<HTMLDivElement>
};

const RemainingWords = ({nextString, nextWordsDivRef}: RemainingWordsProps) => {
  return (
    /* div for remaining chars to type */
    <div className="text-white inline" ref={nextWordsDivRef}>
      {nextString}
    </div>
  );
};

export default RemainingWords;
