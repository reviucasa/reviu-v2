import { useEffect, useState } from "react";
import { Dialog } from "../atoms/Dialog";
import { ConfigValue } from "@/models/types";
import { Stat, Value } from "@/models/analysis";
import { reviewConfigParams } from "@/staticData";
import { useTranslations } from "next-intl";

export const MiniAreaPercent = ({
  stat,
  className,
}: {
  stat: Stat;
  className?: string;
}) => {
  const [maxPercentStat, setMaxPercentStat] = useState<Value>();
  const [statConfig, setStatConfig] = useState<ConfigValue[]>();
  const [openModalInfo, setOpenModalInfo] = useState<boolean>(false);
  const configKeys = useTranslations("configKeys");
  const config = useTranslations("config");
  const t = useTranslations();

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
      // setStatConfig(config.neighbourhood[stat.stat]);
      type NeighbourhoodKey = keyof typeof reviewConfigParams.neighbourhood;
      setStatConfig(
        reviewConfigParams.neighbourhood[stat.stat as NeighbourhoodKey].map(
          (e: string) => {
            return {
              label: config(`neighbourhood.${stat.stat}.${e}`),
              value: e,
            };
          }
        )
      );
      // value: config(`neighbourhood.${[stat.stat]}`),
    }
  }, [config, stat]);
  const roundedPercentage = Math.ceil(maxPercentStat?.percentage ?? 0); // Si el porcentaje es undefined utilizamos por defecto 0

  return (
    <div
      className={`bg-zinc-50 relative flex flex-col border border-gray-300 rounded-lg W-44 pb-4 pt-6 px-6   hover:bg-purple-100 justify-between ${className}`}
    >
      <div
        className={`flex flex-col sm:flex-row  pb-2 text-center items-center justify-between`}
      >
        {/* <button
        className="flex justify-end p-0 h-7 items-center absolute top-2 right-2"
        onClick={() => {
          setOpenModalInfo(true);
        }}
      >
        <Image src={IconInfo} alt={"16"} />
      </button> */}
        <div className="flex flex-col items-center sm:items-start gap-2">
          <h6 className="font-bold text-center sm:text-start md:text-base text-sm">
            {configKeys(`neighbourhood.${stat.stat}`)}
          </h6>
          <p className="text-center sm:text-start text-md md:text-2xl whitespace-nowrap font-extrabold pb-2 font-secondary ">
            {
              statConfig?.find((item) => item.value === maxPercentStat?.key)
                ?.label
            }
          </p>
        </div>

        <div className="w-16 h-16 flex justify-center items-center text-purple-400 bottom-6 hover:scale-110 hover:rounded-full duration-500 cursor-default">
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
              style={{ fill: "#8B5CF6", fontSize: "9px" }}
            >
              {roundedPercentage}%
            </text>
          </svg>
        </div>
      </div>
      <div className="border-b-2"></div>

      <div
        className="pt-2 text-primary-500 cursor-pointer text-sm md:text-base"
        onClick={() => {
          setOpenModalInfo(true);
        }}
      >
        {t("common.verDetalle")}
      </div>
      <Dialog
        isOpen={openModalInfo}
        setIsOpen={() => {
          setOpenModalInfo(false);
        }}
        className="w-[420px]"
      >
        <h5>{configKeys(`neighbourhood.${stat.stat}`)}</h5>
        <p className="pb-6">{t("common.results")}</p>
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
