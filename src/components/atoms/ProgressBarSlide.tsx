import { useEffect, useState } from "react";

type DataProgressType = {
  data: any[];
  currentDataIndex: number;
  setCurrentDataIndex: React.Dispatch<React.SetStateAction<number>>;
};

export const ProgressBarSlide = ({
  data,
  currentDataIndex,
  setCurrentDataIndex,
}: DataProgressType) => {
  const [progress, setProgress] = useState<number>(0);
  // const [currentDataIndex, setCurrentDataIndex] = useState<number>(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 1);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setCurrentDataIndex((prevIndex) => (prevIndex + 1) % data.length);
      setProgress(0);
    }
  }, [data.length, progress, setCurrentDataIndex]);

  return (
    <div className="w-full flex justify-center gap-x-2 mb-10">
      {data.map((_, index) => (
        <progress
          key={index}
          id={`file-${index}`}
          max={100}
          color="red"
          value={index === currentDataIndex ? progress : 0} //preceso actual del value, asi la barrita siempre esta en 0 si no esta en el index actual
          className={`w-[60px] h-1 cursor-pointer [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg `}
          onClick={() => {
            setCurrentDataIndex(index);
            setProgress(0); //cuando hago click en el progessbar me lleva a ese elemento del array
          }}
        ></progress>
      ))}
    </div>
  );
};
