"use client";
import Image from "next/image";
import { useContext } from "react";
import maskGroup from "public/images/maskGroup.png";
import { AreaResumeCardAmbience } from "../molecules/AreaResumeCardAmbience";
import { AreaResumeCardService } from "../molecules/AreaResumeCardServices";
import { MiniAreaPercent } from "../molecules/MiniAreaPercent";
import { useTranslations } from "next-intl";
import { Stat } from "@/models/analysis";
import { BuildingAnalysisContext } from "@/context/BuildingAnalysis";

type AreaResume = {
  stats: Array<Stat>;
  className?: string;
  notEnoughStats: boolean;
};

export const AreaResume = ({
  stats,
  className,
  notEnoughStats,
}: AreaResume) => {
  const { sections, buildingAnalysisSection } = useContext(BuildingAnalysisContext);
  const t = useTranslations();

  return buildingAnalysisSection === Object.keys(sections)[0] ? (
    <div className={`grid lg:gap-6 grid-col gap-4 ${className}`}>
      <h5 className="lg:text-xl text-base mt-16">{t("common.resumenZona")}</h5>
      {notEnoughStats ? (
        <div className="flex flex-col items-center w-full  bg-gray-50 py-14">
          <Image
            src={maskGroup}
            alt="Imagen recopilando datos"
            className="mb-6"
          />
          <h5 className="text-gray-400">{t("common.recopilandoDatos")}</h5>
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 grid-row-2 gap-6 mt-6">
            <div>
              <AreaResumeCardAmbience title={t("common.ambience")} />
            </div>
            <div>
              <AreaResumeCardService title={t("common.services")} />
            </div>
          </div>
          <div className="grid lg:grid-cols-4 lg:grid-rows-1 lg:gap-6 grid-cols-2 grid-rows-2 gap-4">
            {stats.map((stat, index) => (
              <MiniAreaPercent stat={stat} key={index} />
            ))}
          </div>
        </>
      )}
    </div>
  ) : (
    <></>
  );
};
