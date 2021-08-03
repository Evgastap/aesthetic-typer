import React, { useState } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";

type DashboardProps = {
  stats: {
    correctKeystrokes: number[];
    incorrectKeystrokes: number[];
    backspaceKeystrokes: number[];
    wordsTyped: number[];
  };
  startTest: () => void;
};

type CardProps = {
  title: string;
  number: number;
  color: string;
};

const mainAnitmationVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const childrenAnimationVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const Card = ({ title, number, color }: CardProps) => {
  return (
    <motion.div
      variants={childrenAnimationVariants}
      className="p-5 bg-gray-800 rounded-lg"
    >
      <span className="block">{title}</span>
      <span className={`block text-2xl font-extrabold ${color}`}>
        {number}
      </span>
    </motion.div>
  );
};

const Dashbaord = ({ stats, startTest }: DashboardProps) => {
  const cumulativeSum = (
    (sum) => (value: number) =>
      (sum += value)
  )(0);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={mainAnitmationVariants}
      transition={{ staggerChildren: 0.5 }}
      className="w-full grid grid-cols-4 gap-3 text-center text-white mt-3"
    >
      <Card
        title="Correct keystrokes"
        number={stats.correctKeystrokes.reduce(
          (a: number, b: number) => a + b,
          0
        )}
        color="text-darcula-blue"
      />
      <Card
        title="Incorrect keystrokes"
        number={stats.incorrectKeystrokes.reduce(
          (a: number, b: number) => a + b,
          0
        )}
        color="text-darcula-pink"
      />
      <Card
        title="Backspace keystrokes"
        number={stats.backspaceKeystrokes.reduce((a, b) => a + b, 0)}
        color="text-darcula-purple"
      />
      <Card
        title="Words typed"
        number={stats.wordsTyped.reduce((a: number, b: number) => a + b, 0)}
        color="text-darcula-green"
      />
      <motion.div
        variants={childrenAnimationVariants}
        className="p-5 bg-gray-800 rounded-lg col-span-3"
      >
        <span className="block">Speed graph</span>
        <span>WIP :)</span>
      </motion.div>
      <motion.div
        variants={childrenAnimationVariants}
        className="p-5 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-darcula-purple transition duration-500"
        onClick={() => startTest()}
      >
        Restart!
      </motion.div>
    </motion.div>
  );
};

export default Dashbaord;
