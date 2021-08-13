import { motion } from "framer-motion";
import { TOTAL_SECONDS } from "../Constants";

type ProgressBarProps = {
	seconds: number,
	minutes: number
};

const ProgressBar = ({ seconds, minutes }: ProgressBarProps) => {
  return (
    /* progress bar showing seconds remaining */
    <motion.div
      className="h-1 bg-darcula-green relative -top-5 -mx-5"
      initial={{ width: 0 }}
      animate={{
        width: `calc(${
          ((TOTAL_SECONDS - seconds - minutes * 60) / TOTAL_SECONDS) * 100
        }% + 40px)`,
      }}
    />
  );
};

export default ProgressBar;
