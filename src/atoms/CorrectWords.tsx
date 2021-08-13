import React from "react";

const CorrectWords = ({prevString}: { prevString: string } ) => {
  return (
    /* div for correctly typed text */
    <div className="text-darcula-purple inline">{prevString}</div>
  );
};

export default CorrectWords;
