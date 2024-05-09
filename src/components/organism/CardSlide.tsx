import Image from "next/image";
import { useState } from "react";
import ImageBgLeft from "../../../public/images/ImgSlideLeft.svg";
import ImageBgRigth from "../../../public/images/ImgSlideRigth.svg";
import IconHouseLima from "../../../public/images/houseLima.svg";
import { ProgressBarSlide } from "../atoms/ProgressBarSlide";
import { TabMenuSlide } from "../atoms/TabMenuSlide";
import { SectionsType } from "../sectionHome/sectionHeader";
import { useTranslations } from "next-intl";

export const CardSlide = ({
  dataContentSlide,
}: {
  dataContentSlide: SectionsType;
}) => {
  const t = useTranslations();
  const [currentDataIndex, setCurrentDataIndex] = useState<number>(0);
  const [sectionActive, setSectionActive] = useState<number>(0);
  const currentSection = dataContentSlide[sectionActive];

  return (
    <div
      className={`w-full flex flex-col lg:justify-between justify-center lg:h-[700px] rounded-[32px] overflow-hidden ${currentSection.bg}`}
    >
      <div className="flex h-12 justify-center items-center gap-2 bg-black">
        <Image
          src={IconHouseLima}
          alt="icon house lima"
          className="h-4 w-4  lg:h-6 lg:w-6"
        />
        <span className="text-lime">{t("common.reseñasYOpiniones")}</span>
      </div>
      <div className="flex">
        <Image
          src={ImageBgLeft}
          alt="Slide image"
          priority
          className="xl:flex hidden"
        />
        <div className="min-h-[520px] w-full sm:h-full justify-between lg:px-0 px-4  md:pt-14 pt-6  flex flex-col lg:justify-between">
          {/* /section tab */}
          <TabMenuSlide
            sectionActive={sectionActive}
            dataContentSlide={dataContentSlide}
            setSectionActive={setSectionActive}
          />
          <div
            className={`w-full lg:h-[300px] h-[220px] flex items-center justify-center`}
          >
            <h2 className="min-h-[180px] lg:text-5xl text-3xl xs:text-2xl font-extrabold text-center">
              {currentSection.text[currentDataIndex]}
            </h2>
          </div>
          <div className={`w-full flex justify-center mb-0 sm:mb-12`}>
            {currentSection.children}
          </div>
          <ProgressBarSlide
            data={currentSection.text}
            currentDataIndex={currentDataIndex}
            setCurrentDataIndex={setCurrentDataIndex}
          />
        </div>
        <Image
          src={ImageBgRigth}
          alt="Slide image"
          priority
          className="xl:flex hidden"
        />
      </div>
    </div>
  );
};
