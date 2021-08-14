import { motion } from "framer-motion";

const Cursor = () => {
  return (
    /* outer div for cursor to smooth the motion after typing */
    <motion.div
      layout
      transition={{ type: "tween", duration: 0.075 }}
      className="text-green-300 inline absolute text-xl mx-cursor"
    >
      {/* inner div for cursor for blinking animation */}
      <motion.div
        // animate={{ opacity: [0, 1, 1, 0] }}
        // transition={{
        //   duration: 0.75,
        //   times: [0, 0.15, 0.85, 1],
        //   repeat: Infinity,
        // }}
      >
        |
      </motion.div>
    </motion.div>
  );
};

export default Cursor;
