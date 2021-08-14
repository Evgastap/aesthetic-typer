import { motion } from "framer-motion";
import { Line, defaults } from "react-chartjs-2";
import { TOTAL_SECONDS } from "./Constants";

defaults.color = "#FFFFFF";
defaults.scale.grid.color = "#374151";
defaults.scale.grid.display = true;
defaults.scale.grid.borderColor = "#FFF";
defaults.scale.grid.tickColor = "#FFF";

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
  hidden: { opacity: 0, scale: 0.5 },
  show: { opacity: 1, scale: 1 },
  hover: {},
};

const Card = ({ title, number, color }: CardProps) => {
  return (
    <motion.div
      variants={childrenAnimationVariants}
      className="p-5 bg-gray-800 rounded-lg row-span-1 col-span-1 flex items-center justify-center"
    >
      <div className="">
        <div className="">{title}</div>
        <div className={`text-2xl font-extrabold ${color}`}>{number}</div>
      </div>
    </motion.div>
  );
};

const Dashbaord = ({ stats, startTest }: DashboardProps) => {
  const cumulativeSum = (
    (sum) => (value: number) =>
      (sum += value)
  )(0);

  const chartData = {
    labels: Array.from(Array(60).keys()),
    datasets: [
      {
        label: "WPM",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        // color: "#FFFFFF",
        data: stats.wordsTyped
          // .map(cumulativeSum)
          .map(function (n, i) {
            return n / i;
          })
          .map((n) => n * 60),
      },
    ],
  };

  const chartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontColor: "#FFFFFF",
          },
        },
      ],
    },
  };

  return (
      <motion.div
        initial="hidden"
        animate="show"
        variants={mainAnitmationVariants}
        transition={{ staggerChildren: 0.5 }}
        className="w-3/4 max-w-4xl grid grid-cols-4 gap-3 text-center text-white text-base mt-3"
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
          title="Words typed / WPM"
          number={stats.wordsTyped[TOTAL_SECONDS - 1]}
          color="text-darcula-green"
        />
        <motion.div
          variants={childrenAnimationVariants}
          className="p-5 bg-gray-800 rounded-lg col-span-3 row-span-3"
        >
          <Line data={chartData} options={chartOptions} />
        </motion.div>
        <Card
          title="Accuracy"
          number={
            Math.round(
              (100 *
                100 *
                stats.correctKeystrokes.reduce(
                  (a: number, b: number) => a + b,
                  0
                )) /
                (stats.correctKeystrokes.reduce(
                  (a: number, b: number) => a + b,
                  0
                ) +
                  stats.incorrectKeystrokes.reduce(
                    (a: number, b: number) => a + b,
                    0
                  ))
            ) / 100
          }
          color="text-darcula-blue"
        />
        <Card
          title="CPM"
          number={stats.correctKeystrokes.reduce(
            (a: number, b: number) => a + b,
            0
          )}
          color="text-darcula-pink"
        />
        <motion.div
          variants={childrenAnimationVariants}
          className="p-5 bg-gray-800 rounded-lg row-span-1 h-full flex items-center justify-center cursor-pointer hover:bg-darcula-purple transition duration-500"
          onClick={() => startTest()}
        >
          <svg
            width="32px"
            height="32px"
            viewBox="0 0 303.596 303.596"
            className="mr-3"
          >
            <path
              style={{ fill: "#FFF" }}
              d="M273.193,62.099C245.08,25.376,202.332,4.314,155.911,4.314c-32.636,0-63.584,10.485-89.5,30.323
	c-9.377,7.179-17.86,15.48-25.245,24.642l-6.585-37.299c-0.721-4.079-4.615-6.807-8.69-6.082L6.196,19.374
	c-1.959,0.346-3.7,1.456-4.841,3.085c-1.141,1.63-1.587,3.645-1.241,5.604l15.646,88.629c0.643,3.638,3.807,6.198,7.377,6.198
	c0.433,0,0.872-0.038,1.313-0.116l88.63-15.646c4.079-0.72,6.802-4.61,6.082-8.689l-3.477-19.695
	c-0.346-1.959-1.455-3.7-3.085-4.841c-1.63-1.141-3.645-1.586-5.604-1.241l-36.933,6.52c5.195-6.14,11.075-11.741,17.624-16.754
	c19.762-15.127,43.361-23.122,68.247-23.122c35.419,0,68.028,16.063,89.469,44.069c18.266,23.86,26.146,53.406,22.19,83.194
	c-3.957,29.789-19.277,56.254-43.138,74.519c-19.818,15.171-43.38,23.19-68.139,23.19c-4.996,0-10.062-0.336-15.057-0.999
	c-29.788-3.956-56.253-19.275-74.519-43.137c-11.118-14.523-18.59-31.659-21.609-49.556c-0.331-1.961-1.428-3.711-3.049-4.864
	c-1.62-1.153-3.634-1.613-5.595-1.284l-19.721,3.327c-4.084,0.689-6.836,4.559-6.148,8.643c3.963,23.495,13.759,45.975,28.33,65.009
	c23.948,31.284,58.647,51.37,97.702,56.557c6.534,0.868,13.165,1.308,19.708,1.308c32.486,0,63.39-10.514,89.369-30.402
	c31.285-23.948,51.371-58.647,56.558-97.703C307.475,132.121,297.143,93.383,273.193,62.099z"
            />
          </svg>
          Restart!
        </motion.div>
      </motion.div>
  );
};

export default Dashbaord;
