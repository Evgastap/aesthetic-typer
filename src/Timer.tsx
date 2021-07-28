import React from "react";
import { useTimer } from "react-timer-hook";
import { motion } from "framer-motion";

function Timer() {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 60);
  const expiryTimestamp = time.getTime();

  const {
    seconds,
    minutes,
	start
  } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  return (
	  <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 3}} className="absolute w-full -top-16 text-center text-gray-400 text-4xl mb-5">{minutes * 60 + seconds}</motion.div>
  );
}

export default Timer;
