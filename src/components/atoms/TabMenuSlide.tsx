import React, { Dispatch, SetStateAction } from "react";
import { SectionType, SectionsType } from "../sectionHome/sectionHeader";

type TabMenuSlideProps = {
  dataContentSlide: SectionsType;
  setSectionActive: Dispatch<SetStateAction<number>>;
  sectionActive: number;
};

export const TabMenuSlide = ({
  dataContentSlide,
  sectionActive,
  setSectionActive,
}: TabMenuSlideProps): JSX.Element => (
  <div className="w-min md:w-full flex flex-col self-center md:flex-row justify-center lg:gap-12 lg:text-base text-[15px] sm:gap-4 xs:text-[11px] gap-2 whitespace-nowrap font-medium">
    {/* section tab */}
    {dataContentSlide.map((tab: SectionType, index) => {
      return (
        <React.Fragment key={index}>
          <span
            key={index}
            onClick={() => setSectionActive(index)}
            className={`cursor-pointer border-transparent text-center border-b-2  ${
              sectionActive === index ? dataContentSlide[index].styleBorder : ""
            }`}
          >
            {tab.title}
          </span>
        </React.Fragment>
      );
    })}
  </div>
);
