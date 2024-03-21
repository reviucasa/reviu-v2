import Image from "next/image";
import { useEffect, useState } from "react";
import IconInfo from "../../../public/IconInfo.png";
import { Dialog } from "../atoms/Dialog";
import { ConfigValue, Stat, Value } from "@/models/types";

export const MiniAreaPorcent = ({
  stat,
  className,
}: {
  stat: Stat;
  className?: string;
}) => {
  const [maxPercentStat, setMaxPercentStat] = useState<Value>();
  const [statConfig, setStatConfig] = useState<ConfigValue[]>();
  const [openModalInfo, setOpenModalInfo] = useState<boolean>(false);

  useEffect(() => {
    if (stat) {
      const result = stat.values.reduce(
        (acc, value) => (value.value > acc.value ? value : acc),
        stat.values[0]
      );
      setMaxPercentStat(result);
    }
  }, [stat]);

  useEffect(() => {
    if (stat) {
      //@ts-ignore
      setStatConfig(config.neighbourhood[stat.stat]);
    }
  }, [stat]);
  const roundedPercentage = Math.ceil(maxPercentStat?.percentage ?? 0); // Si el porcentaje es undefined utilizamos por defecto 0

  return (
    <div
      className={`bg-zinc-50 relative flex flex-col border border-gray-300 rounded-lg W-44 pb-6 pt-6 px-4 text-center items-center hover:bg-purple-100 justify-between ${className}`}
    >
      <button
        className="flex justify-end p-0 h-7 items-center absolute top-1 right-0"
        onClick={() => {
          setOpenModalInfo(true);
        }}
      >
        <Image src={IconInfo} alt={"16"} />
      </button>
      <h6 className="font-bold md:text-base text-sm">
        {stat.stat_display_text}
      </h6>
      <p className="text-base md:text-2xl font-extrabold pb-2">
        {statConfig?.find((item) => item.value === maxPercentStat?.key)?.label}
      </p>

      <div className="w-16 h-16 flex justify-center items-center text-purple-400 bottom-6 hover:scale-110 hover:rounded-full duration-500 cursor-default	">
        <svg viewBox="0 0 36 36">
          <path
            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="white"
            stroke="#C5B3FA"
            strokeWidth="3"
            strokeDasharray="100, 100"
          />
          <path
            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="transparent"
            stroke="#9E80F7"
            strokeWidth="3"
            strokeDasharray={`${roundedPercentage}, 100`}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy="0.3em"
            style={{ fill: "#8B5CF6", fontSize: "10px" }}
          >
            {roundedPercentage}%
          </text>
        </svg>
      </div>
      <Dialog
        isOpen={openModalInfo}
        setIsOpen={() => {
          setOpenModalInfo(false);
        }}
        className="w-[420px]"
      >
        <h5>Resultados</h5>
        <p className="pb-6">{stat.stat}</p>
        {statConfig?.map((config, index) => {
          const percent = stat.values.find((value) => {
            return value.key === config.value;
          })?.percentage;
          return (
            <div key={index}>
              <label className="m-0">{config.label}</label>
              <p className="pb-6 text-purple-400 font-bold">
                {" "}
                {percent || 0} %
              </p>
            </div>
          );
        })}
      </Dialog>
    </div>
  );
};
