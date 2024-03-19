import { OpinionCard } from "@/components/molecules/OpinionCard";
import { ReviewData } from "@/models/review";
import { useTranslations } from "next-intl";

type FloorValuationProps = {
  reviews: Array<ReviewData>;
};

export const FloorValuation = ({ reviews }: FloorValuationProps) => {
  const t = useTranslations();
  // draw review information in boxes
  return (
    <div>
      <h5>{t("floorValuations:floorValuations")}</h5>
      <p>
        {reviews.length} {t("common.reviews")}
      </p>
      {reviews.map((review) => (
        <OpinionCard className="my-6" key={review.id} review={review} />
      ))}
    </div>
  );
};
