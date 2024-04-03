import { CommunityCard } from "@/components/molecules/CommunityCard";
import { OpinionCard } from "@/components/molecules/OpinionCard";
import { AnalysisContext } from "@/context/AnalysisSectionActive";
import { Review } from "@/models/review";
import { useTranslations } from "next-intl";
import { useContext } from "react";

type GeneralValuationProps = {
  reviews: Array<Review>;
};

export const GeneralValuation = ({ reviews }: GeneralValuationProps) => {
  const t = useTranslations();

  // draw review information in boxes
  const { setAnalysisSectionActive, sections } = useContext(AnalysisContext);

  const viewAllOpinions = t("generalValuation:viewAllOpinions");
  return (
    <div>
      <div>
        <h5 className="text-base lg:text-xl">
          {t("generalValuation:latestOpinions")}
        </h5>
        {reviews.slice(0, 2).map((review) => (
          <OpinionCard className="my-6" key={review.id} review={review} />
        ))}
        <span
          className="w-full flex justify-center cursor-pointer pt-3 text-sm md:text-base"
          onClick={() => {
            setAnalysisSectionActive(Object.keys(sections)[1]);
          }}
        >{`${viewAllOpinions} (${reviews.length}) >`}</span>
      </div>

      <div className="mt-16">
        <h5 className="text-base lg:text-xl">
          {t("generalValuation:recentOpinions")}
        </h5>
        {reviews.slice(0, 1).map((review) => (
          <CommunityCard className="my-6" key={review.id} review={review} />
        ))}
        <a
          className="w-full flex justify-center cursor-pointer text-sm md:text-base"
          onClick={() => setAnalysisSectionActive(Object.keys(sections)[2])}
        >{`${viewAllOpinions} (${reviews.length}) >`}</a>
      </div>
    </div>
  );
};
