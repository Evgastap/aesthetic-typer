import { motion } from "framer-motion";

type TimerProps = {
  minutes: number,
  seconds: number
}

function Timer({ minutes, seconds }: TimerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3 }}
      className="absolute w-full -top-16 text-center text-gray-400 text-4xl mb-5"
    >
      {minutes * 60 + seconds}
    </motion.div>
  );
}

export default Timer;
