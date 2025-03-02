"use client";
import { useSearchParams } from "next/navigation";

import {
  Coordinates,
  getReviewsFromCoordinates,
  Review,
} from "@/models/review";
import { BounceLoader } from "react-spinners";
import OpenStreetMapMultiple from "@/components/molecules/OpenStreetMapMultiple";
import { OpinionCardSmall } from "@/components/molecules/OpinionCardSmall";
import MainLayout from "@/components/layouts/MainLayout";
import { useCallback, useEffect, useState } from "react";

// Dynamically import the MainLayout component
// const MainLayout = dynamic(() => import("@/components/layouts/MainLayout"), {
//   ssr: false,
// });

export default function ExplorePage({
  title,
  reviews: initialReviews,
  loading,
  empty,
  coordinates,
}: {
  title: string;
  reviews: Review[];
  loading: boolean;
  empty: boolean;
  coordinates: Coordinates;
}) {
  const searchParams = useSearchParams();

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [highlightedReviewId, setHighlightedReviewId] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Ensure reviews update when new ones are passed from props
    setReviews(initialReviews);
  }, [initialReviews]);

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
  console.log(searchParams.get("lat"));
  return (
    <MainLayout>
      <div className="lg:p-10 p-4 mb-10 lg:mb-0">
        <div className=" relative lg:gap-8 md:gap-4 ">
          <h1 className="text-xl lg:text-2xl  font-secondary">{title}</h1>
          {/* <p className="text-sm tracking-widest">
            {empty ? 0 : reviews.length}
            {" reviews in total"}
          </p> */}
          <div className="flex flex-col lg:flex-row w-full mt-8 bg-white rounded-2xl">
            <div className="lg:hidden h-[400px] w-full center pt-8 px-8 ">
              {!loading ? (
                <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg">
                  <OpenStreetMapMultiple
                    reviews={reviews}
                    zoom={16}
                    coordinates={coordinates}
                    updateReviews={updateReviews}
                    highlightedReviewId={highlightedReviewId}
                    setHighlightedReviewId={setHighlightedReviewId}
                    showPin={searchParams.get("lat") != null && true}
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg">
                  <BounceLoader color="#d8b4fe" size={100} />
                </div>
              )}
            </div>
            <div className="relative lg:hidden mx-8 mt-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-sm text-gray-400">
                  Reviews
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-[480px] lg:flex lg:flex-col lg:space-y-4 lg:gap-0 lg:w-[424px] lg:h-[820px] overflow-y-auto py-8 px-8">
              {!loading && !empty && reviews.length != 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    onMouseEnter={() => {
                      /* updateReviews(
                        review.location!.coordinates.latitude,
                        review.location!.coordinates.longitude,
                        16
                      ); */
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
              ) : (!loading && empty) || reviews.length == 0 ? (
                <div className="flex justify-center items-center py-40 w-full lg:w-[392px] h-full">
                  {"No reviews found"}
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
                    showPin={searchParams.get("lat") != null && true}
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
