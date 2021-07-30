import React from "react";
import { motion } from 'framer-motion'

type DashboardProps = {
  stats: {
    correctKeystrokes: number[];
    incorrectKeystrokes: number[];
    backspaceKeystrokes: number[];
    wordsTyped: number[];
  };
};

type CardProps = {
  title: string;
  number: number;
  color: string;
};

const Card = ({ title, number, color }: CardProps) => {
  return (
    <div className="p-5 bg-gray-800 rounded-lg">
      <span className="block">{title}</span>
      <span className={`block text-2xl font-extrabold text-${color}`}>
        {number}
      </span>
    </div>
  );
};

const Dashbaord = ({ stats }: DashboardProps) => {
  return (
    <div className="w-full grid grid-cols-3 gap-3 text-center text-white">
      <Card
        title="Correct keystrokes"
        number={stats.correctKeystrokes.reduce(
          (a: number, b: number) => a + b,
          0
        )}
        color="darcula-blue"
      />
      <Card
        title="Incorrect keystrokes"
        number={stats.incorrectKeystrokes.reduce(
          (a: number, b: number) => a + b,
          0
        )}
        color="darcula-pink"
      />
      <Card
        title="Backspace keystrokes"
        number={stats.backspaceKeystrokes.reduce((a, b) => a + b, 0)}
        color="darcula-purple"
      />
      <Card
        title="Words typed"
        number={stats.wordsTyped.reduce((a: number, b: number) => a + b, 0)}
        color="darcula-green"
      />
	  <div className="p-5 bg-gray-800 rounded-lg col-span-2">
		  <span className="block">Speed graph</span>
	  </div>
    </div>
  );
};

export default Dashbaord;
