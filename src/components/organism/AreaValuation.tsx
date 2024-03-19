import { useTranslations } from "next-intl";
import { AreaCard } from "../molecules/AreaCard";
import { ReviewData } from "@/models/types";

type AreaValuation = {
  reviews: Array<ReviewData>;
};

export const AreaValuation = ({ reviews }: AreaValuation) => {
  const t = useTranslations();

  // draw review information in boxes
  return (
    <div className="flex-1">
      <h5>{t("areaValuations:areaValuations")}</h5>
      <p>
        {reviews.length} {t("common.reviews")}
      </p>
      {reviews.map((review) => (
        <AreaCard className="my-6" key={review.id} review={review} />
      ))}
    </div>
  );
};
