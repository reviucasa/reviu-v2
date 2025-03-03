"use client";
import { Review, getAllReviews } from "@/models/review";
import { useQuery } from "@tanstack/react-query";
import OpenStreetMapMultiple from "../molecules/OpenStreetMapMultiple";
import OpenStreetMap from "../molecules/OpenStreetMap";
import { BounceLoader } from "react-spinners";

export default function ReviewsMap() {
  const { data: reviews, isFetching } = useQuery<Review[] | undefined, Error>({
    queryKey: ["reviews"],
    queryFn: () => getAllReviews(),
  });

  return (
    <div className="pb-6 space-y-12">
      <div className=" space-y-8">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900">
          Reviews Map
        </h3>
        <div className=" h-80 sm:h-[720px] w-full my-10 center align-middle">
          {reviews && reviews.length > 0 ? (
            <OpenStreetMapMultiple
              reviews={reviews}
              zoom={13}
              highlightedReviewId={""}
              setHighlightedReviewId={() => {}}
              iconSize="sm"
            />
          ) : isFetching ? (
            <div className="flex justify-center items-center py-40">
              <BounceLoader color="#d8b4fe" size={100} />
            </div>
          ) : (
            <OpenStreetMap
              latitude={41.40855}
              longitude={2.17114}
              circleDecoration={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
