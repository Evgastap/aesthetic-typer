import { motion } from "framer-motion";
import { useState } from "react";

const Footer = () => {
  const [infoHover, setInfoHover] = useState(false);

  return (
    <>
      {infoHover !== undefined && (
        <motion.div
          className="w-1/2 bg-white rounded-lg shadow-md p-6 absolute top-0 left-1/4"
          initial={{ y: "-125%" }}
          animate={{ y: `${infoHover ? "10px" : "-125%"}` }}
        >
          <span className="w-full  block leading-normal text-gray-800 text-md text-justify">
            This site is a game built to measure your typing speed with a clean,
            pleasent interface. Start typing, and the countdown will begin.
            Become one with your keyboard, and enjoy the minimal look. As the 60
            seconds are up, you will see your statistics, such as WPM, errors,
            keystrokes, and more. Oh, and I only learned afterwards that
            monkeytype.com exists :(
          </span>
        </motion.div>
      )}

      <footer className="absolute w-full bottom-5 flex flex-row justify-center items-center text-white font-ubuntu">
        <a
          href="https://www.buymeacoffee.com/evgastap"
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center"
        >
          <span className="mr-2 text-gray-800 py-2 px-5 bg-white rounded-2xl">
            Buy me a ☕️
          </span>
        </a>
        <div className="ml-5"> | </div>
        <motion.div
          className="text-white inline ml-5 cursor-pointer"
          onHoverStart={() => setInfoHover(true)}
          onHoverEnd={() => setInfoHover(false)}
        >
          The heck is this site?
        </motion.div>
        <div className="ml-5"> | </div>
        <div className="ml-5">
          Made with ☕️ and ❤️ by{" "}
          <a className="underline" href="https://evgenyastapov.com">
            Evgeny Astapov
          </a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
