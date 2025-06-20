"use client";

import {
  
  getReviewsFromCoordinates,
  Review,
} from "@/models/review";
import { BounceLoader } from "react-spinners";
import { OpinionCardSmall } from "@/components/molecules/OpinionCardSmall";
import MainLayout from "@/components/layouts/MainLayout";
import { useCallback, useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Coordinates } from "@/models/building";

const OpenStreetMapMultiple = dynamic(
  () => import("@/components/molecules/OpenStreetMapMultiple"),
  {
    ssr: false,
  }
);

export default function ExplorePage({
  title,
  reviews: initialReviews,
  loading,
  coordinates,
}: {
  title: string;
  reviews: Review[];
  loading: boolean;
  coordinates: Coordinates;
}) {
  const t = useTranslations();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [highlightedReviewId, setHighlightedReviewId] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Ensure reviews update when new ones are passed from props
    setReviews(initialReviews);
  }, [initialReviews]);

  useEffect(() => {
    // Ensure reviews update when new ones are passed from props
    updateReviews(coordinates.latitude, coordinates.longitude, 16);
  }, [coordinates]);

  const updateReviews = useCallback(
    async (lat: number, lng: number, zoom: number) => {
      try {
        const adaptiveRadius = 40000 / Math.pow(2, zoom);
        const newReviews = await getReviewsFromCoordinates(
          lat,
          lng,
          adaptiveRadius
        );
        setReviews(newReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    },
    []
  );

  return (
    <MainLayout>
      <div className="md:p-10 p-2 mb-10 lg:mb-0">
        <div className=" relative lg:gap-8 md:gap-4 ">
          <h1 className="text-xl lg:text-2xl mt-2 md:mt-0 font-secondary">
            {title}
          </h1>
          {/* <p className="text-sm tracking-widest">
            {empty ? 0 : reviews.length}
            {" reviews in total"}
          </p> */}
          <div className="flex flex-col lg:flex-row w-full mt-4 md:mt-8 bg-white rounded-2xl">
            <div className="lg:hidden h-[400px] w-full center pt-4 md:pt-8 px-4 md:px-8 ">
              {!loading ? (
                <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg">
                  <OpenStreetMapMultiple
                    reviews={reviews}
                    zoom={16}
                    coordinates={coordinates}
                    updateReviews={updateReviews}
                    highlightedReviewId={highlightedReviewId}
                    setHighlightedReviewId={setHighlightedReviewId}
                    showPin={/* searchParams.get("lat") != null && */ true}
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg">
                  <BounceLoader color="#d8b4fe" size={100} />
                </div>
              )}
            </div>
            <div className="relative lg:hidden md:mx-8 mx-4 md:mt-8 mt-4">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-sm text-gray-400">
                  {t("common.reviews")}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center md:grid md:grid-cols-2 md:gap-4 gap-2 w-full h-[480px] lg:flex lg:flex-col lg:space-y-4 lg:gap-0 lg:w-[424px] lg:h-[820px] overflow-y-auto md:py-8 py-4 md:px-8 px-2">
              {!loading && reviews.length != 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    onMouseEnter={() => {
                      return setHighlightedReviewId(review.id);
                    }}
                    onMouseLeave={() => setHighlightedReviewId(null)}
                  >
                    <OpinionCardSmall
                      review={review}
                      sizeCard={360}
                      compressed={true}
                      className={
                        highlightedReviewId == review.id
                          ? "!border-2 !border-secondary-500 !px-[23px] !py-[15px]"
                          : ""
                      }
                    />
                  </div>
                ))
              ) : !loading && reviews.length == 0 ? (
                <div className="flex justify-center items-center py-40 w-full lg:w-[392px] h-full">
                  {t("common.noReviewsFound")}
                </div>
              ) : (
                <div className="flex justify-center items-center py-40 w-full lg:w-[392px] h-full">
                  <BounceLoader color="#d8b4fe" size={100} />
                </div>
              )}
            </div>
            <div className="hidden lg:block h-96 sm:h-[820px] flex-grow center align-middle p-8 pl-4">
              {!loading ? (
                <div className="flex justify-center items-center py-0 w-full h-full bg-gray-100 rounded-lg">
                  <OpenStreetMapMultiple
                    reviews={reviews}
                    zoom={16}
                    coordinates={coordinates}
                    updateReviews={updateReviews}
                    highlightedReviewId={highlightedReviewId}
                    setHighlightedReviewId={setHighlightedReviewId}
                    showPin={/* searchParams.get("lat") != null && */ true}
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center py-40 w-full h-full bg-gray-100 rounded-lg">
                  <BounceLoader color="#d8b4fe" size={100} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
