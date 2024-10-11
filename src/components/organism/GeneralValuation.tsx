"use client";
import { CommunityCard } from "@/components/molecules/CommunityCard";
import { OpinionCard } from "@/components/molecules/OpinionCard";
import { BuildingAnalysisContext } from "@/context/BuildingAnalysis";
import { Review } from "@/models/review";
import { useTranslations } from "next-intl";
import { useContext } from "react";

type GeneralValuationProps = {
  reviews: Array<Review>;
};

export const GeneralValuation = ({ reviews }: GeneralValuationProps) => {
  const t = useTranslations();

  const { setBuildingAnalysisSection, sections } = useContext(BuildingAnalysisContext);

  const viewAllOpinions = t("generalValuation.viewAllOpinions");
  return (
    <div>
      <div>
        <h2 className="h-plain text-base lg:text-xl">
          {t("generalValuation.latestOpinions")}
        </h2>
        {reviews.slice(0, 2).map((review) => (
          <OpinionCard className="my-6" key={review.id} review={review} />
        ))}
        <a
          className="w-full flex justify-center cursor-pointer pt-3 text-sm md:text-base"
          onClick={() => {
            setBuildingAnalysisSection(Object.keys(sections)[1]);
          }}
        >{`${viewAllOpinions} (${reviews.length}) >`}</a>
      </div>

      <div className="mt-16">
        <h2 className="h-plain text-base lg:text-xl">
          {t("generalValuation.recentOpinions")}
        </h2>
        {reviews.slice(0, 1).map((review) => (
          <CommunityCard className="my-6" key={review.id} review={review} />
        ))}
        <a
          className="w-full flex justify-center cursor-pointer text-sm md:text-base"
          onClick={() => setBuildingAnalysisSection(Object.keys(sections)[2])}
        >{`${viewAllOpinions} (${reviews.length}) >`}</a>
      </div>
    </div>
  );
};
