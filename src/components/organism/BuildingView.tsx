"use client";
import { TabMenu } from "@/components/atoms/TabMenu";
import { AreaResume } from "@/components/organism/AreaResume";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import { useState } from "react";
import { AreaValuation } from "@/components/organism/AreaValuation";
import { CommunityValuation } from "@/components/organism/CommunityValuation";
import { FloorValuation } from "@/components/organism/FloorValuation";
import { GeneralValuation } from "@/components/organism/GeneralValuation";
import { Link } from "@/navigation";
import { BuildingAnalysisContext } from "@/context/BuildingAnalysis";

export default function BuildingView({
  analysis,
  children,
}: {
  analysis: any;
  children?: React.ReactNode;
}) {
  const t = useTranslations();
  const tLinks = useTranslations("linksTitles");

  const [activeSection, setActiveSection] =
    useState<string>("valuationGeneral");

  const OpenStreetMap = useMemo(() => {
    return dynamic(() => import("../molecules/OpenStreetMap"), {
      ssr: false,
    });
  }, []);

  const sections: {
    [key: string]: { title: string; sectionObject: JSX.Element };
  } = {
    valuationGeneral: {
      title: t("common.valuationGeneral"),
      sectionObject: <GeneralValuation reviews={analysis.reviews} />,
    },
    valuationFloor: {
      title: t("common.valuationFloor"),
      sectionObject: <FloorValuation reviews={analysis.reviews} />,
    },
    valuationCommunity: {
      title: t("common.valuationCommunity"),
      sectionObject: <CommunityValuation reviews={analysis.reviews} />,
    },
    valuationArea: {
      title: t("common.valuationArea"),
      sectionObject: <AreaValuation reviews={analysis.reviews} />,
    },
  };

  const menuOptions = Object.keys(sections).map((sectionKey) => {
    return {
      key: sectionKey,
      title: sections[sectionKey].title,
      onClick: () => setActiveSection(sectionKey),
    };
  });

  const notOpinions = analysis.reviews.length === 0;
  const notEnoughStats =
    analysis.neighbourhood.stats.length == 0
      ? true
      : analysis.neighbourhood.stats[0].total < 1;

  return (
    <BuildingAnalysisContext.Provider
      value={{
        sections: sections,
        buildingAnalysisSection: activeSection,
        setBuildingAnalysisSection: setActiveSection,
        wordCloud: analysis.neighbourhood.wordCloud,
      }}
    >
      <div>
        <div className="h-32 sm:h-72 w-full">
          <OpenStreetMap
            latitude={analysis.latitude}
            longitude={analysis.longitude}
          />
        </div>
        {!notOpinions && (
          <TabMenu
            className="mt-8 mb-14"
            options={menuOptions}
            activeOption={activeSection}
          />
        )}

        {!notOpinions && <div>{sections[activeSection].sectionObject}</div>}
        {notOpinions && (
          <div className="flex flex-col items-center border border-gray-300 rounded-md py-12 px-8 mt-10 ">
            <h4>{t("common.noHayOpiniones")}</h4>
            <p className="mt-1 mb-8">{t("common.hasVividoAqui")} </p>
            <Link
              className="btn btn-primary-500 content-center overflow-hidden px-14"
              href="/newReview"
              title={tLinks("/newReview")}
            >
              {t("common.writeReview")}
            </Link>
          </div>
        )}
      </div>

      {children}
      <AreaResume
        className="col-span-2"
        stats={analysis.neighbourhood.stats}
        notEnoughStats={notEnoughStats}
      />
    </BuildingAnalysisContext.Provider>
  );
}
