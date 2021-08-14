import { AnimatePresence, motion } from "framer-motion";
import Timer from "./Timer";
import Dashboard from "./Dashboard";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import Cursor from "./atoms/Cursor";
import CorrectWords from "./atoms/CorrectWords";
import IncorrectWords from "./atoms/IncorrectWords";
import RemainingWords from "./atoms/RemainingWords";
import ProgressBar from "./atoms/ProgressBar";
import useTyper from "./useTyper";

const App = () => {
  const [words, stats, lines, appState, time, nextWordsDivRef, utilFuncs] =
    useTyper();

  return (
    // parent div
    <div
      className="w-screen h-screen bg-gray-700 flex items-center justify-center flex-col text-lg"
      tabIndex={0}
      onKeyDown={(e) => appState !== "summary" && utilFuncs.handleKeyPress(e)}
    >
      <AnimatePresence>
        {appState === "loading" ? (
          // loader for when words are loading
          <ClimbingBoxLoader color={"#BF9FF7"} />
        ) : (
          // parent div with dark background
          <motion.div
            className="w-3/4 min-h-2 relative max-w-4xl justify-center p-5 bg-gray-800 rounded-lg block overflow-hidden"
            layout
          >
            <ProgressBar seconds={time.seconds} minutes={time.minutes} />
            {appState === "typing" && (
              // timer of seconds remaining
              <Timer seconds={time.seconds} minutes={time.minutes} />
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
                animate={{
                  y: `${-1.75 * Math.max(0, lines.linesTyped - 1)}rem`,
                }}
              >
                <CorrectWords prevString={words.prevString} />
                <Cursor />
                <IncorrectWords
                  currentString={words.currentString}
                  wrongString={words.wrongString}
                />
                <RemainingWords
                  nextString={words.nextString}
                  nextWordsDivRef={nextWordsDivRef}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
        {/* summary dashboard for after type test */}
        {appState === "summary" && (
          <Dashboard stats={stats} startTest={utilFuncs.restartTest} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
