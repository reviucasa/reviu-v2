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
  const reviewsCount = 60;
  const t = useTranslations();
  const [latestReviews, setLatestReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReviews = async (number: number) => {
    setLoading(true);

    try {
      const response = await getReviews({
        count: number,
        random: true,
      });
      setLatestReviews(
        response
          .sort((a, b) => {
            const aHasImages = a.data.opinion!.images?.length > 0;
            const bHasImages = b.data.opinion!.images?.length > 0;

            // If both have images, sort by the number of images
            if (aHasImages && bHasImages) {
              return (
                b.data.opinion!.images.length - a.data.opinion!.images.length
              );
            }

            // If only one has images, prioritize the one with images
            if (aHasImages) return -1;
            if (bHasImages) return 1;

            // If neither has images, maintain original order
            return 0;
          })
          .slice(0, 12)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(reviewsCount);
  }, []);

  return (
    <div className="w-full">
      {loading && (
        <div className="flex justify-center items-center fixed w-full h-full z-50 bg-white opacity-90">
          <BounceLoader color="#d8b4fe" size={140} />
        </div>
      )}
      <SlideReview
        title={t("common.latestReviews")}
        reviews={latestReviews}
        sizeCard={380}
        sizeGapCard={28}
        sizeGapCardMobile={16}
      />
    </div>
  );
}
