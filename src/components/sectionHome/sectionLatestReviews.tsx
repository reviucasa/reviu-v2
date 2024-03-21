"use client";
import { Review, getReviews } from "@/models/review";
import { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";
import { SlideReview } from "../organism/SlideReview";
import { useTranslations } from "next-intl";

export type CardReviewType = {
  title: string;
  text: Array<string>;
  children: React.ReactNode;
  styleBorder: string;
  bg: string;
};

export type SectionsType = Array<CardReviewType>;

export function SectionLatestReviews() {
  const t = useTranslations();
  const [dataLatestReviews, setDataLatestReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReviews = async (number?: number) => {
    setLoading(true);

    try {
      const response = await getReviews(number);
      setDataLatestReviews(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(2);
  }, []);

  return (
    <div className="w-full">
      {loading && (
        <div className="flex justify-center items-center fixed  w-full h-full z-50 bg-white opacity-90">
          <BounceLoader color="#d8b4fe" size={140} />
        </div>
      )}
      <SlideReview
        title={t("common.latestReviews")}
        dataReview={dataLatestReviews}
        sizeCard={420}
        sizeGapCard={28}
        sizeGapCardMobile={16}
      />
    </div>
  );
}
