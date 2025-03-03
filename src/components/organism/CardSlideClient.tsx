"use client";
import Image from "next/image";
import ImageBgLeft from "../../../public/images/ImgSlideLeft.png";
import ImageBgRigth from "../../../public/images/ImgSlideRigth.png";
import { useState } from "react";
import { ProgressBarSlide } from "../atoms/ProgressBarSlide";
import { TabMenuSlide } from "../atoms/TabMenuSlide";
import { SectionsType } from "../sectionHome/sectionHeader";

const CardSlideClient = ({
  dataContentSlide,
}: {
  dataContentSlide: SectionsType;
}) => {
  const [currentDataIndex, setCurrentDataIndex] = useState<number>(0);
  const [sectionActive, setSectionActive] = useState<number>(0);
  const currentSection = dataContentSlide[sectionActive];

  return (
    <div className={`flex ${currentSection.bg} rounded-b-[32px] overflow-visible`}>
      <Image
        src={ImageBgLeft}
        alt="Slide image"
        priority
        className="xl:flex hidden overflow-hidden"
      />
      <div className="min-h-[520px] w-full sm:h-full justify-between lg:px-0 px-4 md:pt-14 pt-6 flex flex-col lg:justify-between">
        <TabMenuSlide
          sectionActive={sectionActive}
          dataContentSlide={dataContentSlide}
          setSectionActive={setSectionActive}
        />
        <div className="w-full lg:h-[300px] h-[140px] flex items-center justify-center">
          <h1 className="min-h-[160px] lg:text-5xl text-3xl xs:text-2xl font-extrabold text-center">
            {currentSection.text[currentDataIndex]}
          </h1>
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
        className="xl:flex hidden overflow-hidden"
      />
    </div>
  );
};

export default CardSlideClient;
