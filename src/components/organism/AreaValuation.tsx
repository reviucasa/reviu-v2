"use client";
import { useTranslations } from "next-intl";
import { AreaCard } from "../molecules/AreaCard";
import { Review } from "@/models/review";

type AreaValuation = {
  reviews: Array<Review>;
};

export const AreaValuation = ({ reviews }: AreaValuation) => {
  const t = useTranslations();

  // draw review information in boxes
  return (
    <div className="flex-1">
      <h5>{t("areaValuations.areaValuations")}</h5>
      <p>
        {reviews.length} {t("common.reviews")}
      </p>
      {reviews.map((review) => (
        <AreaCard className="my-6" key={review.id} review={review} />
      ))}
    </div>
  );
};
