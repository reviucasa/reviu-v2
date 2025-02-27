"use client";
import { Coordinates, Review } from "@/models/review";
import dynamic from "next/dynamic";
import { BounceLoader } from "react-spinners";
import OpenStreetMapMultiple from "@/components/molecules/OpenStreetMapMultiple";
import { OpinionCardSmall } from "@/components/molecules/OpinionCardSmall";
import MainLayout from "@/components/layouts/MainLayout";

// Dynamically import the MainLayout component
// const MainLayout = dynamic(() => import("@/components/layouts/MainLayout"), {
//   ssr: false,
// });

export default function ExplorePage({
  title,
  reviews,
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
  return (
    <MainLayout>
      <div className="lg:p-10 p-4 mb-10 lg:mb-0">
        <div className=" relative lg:gap-8 md:gap-4 ">
          <h1 className="text-2xl lg:text-3xl  font-secondary">{title}</h1>
          <p className="text-sm tracking-widest">
            {empty ? 0 : reviews.length}
            {" reviews in total"}
          </p>
          <div className="flex flex-col lg:flex-row w-full mt-8 bg-white rounded-2xl">
            <div className="lg:hidden h-[400px] w-full center pt-8 px-8 ">
              {!loading ? (
                <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg">
                  <OpenStreetMapMultiple
                    reviews={reviews}
                    zoom={15}
                    coordinates={coordinates}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-[480px] lg:flex lg:flex-col lg:space-y-4 lg:gap-0 lg:w-[424px] lg:h-[720px] overflow-y-auto py-8 px-8">
              {!loading && !empty ? (
                reviews.map((review) => (
                  <OpinionCardSmall
                    key={review.id}
                    review={review}
                    sizeCard={360}
                  />
                ))
              ) : empty ? (
                <div className="flex justify-center items-center py-40 w-full lg:w-[392px] h-full">
                  {"No reviews found"}
                </div>
              ) : (
                <div className="flex justify-center items-center py-40 w-full lg:w-[392px] h-full">
                  <BounceLoader color="#d8b4fe" size={100} />
                </div>
              )}
            </div>
            <div className="hidden lg:block h-96 sm:h-[720px] flex-grow center align-middle p-8 pl-4">
              {!loading ? (
                <div className="flex justify-center items-center py-0 w-full h-full bg-gray-100 rounded-lg">
                  <OpenStreetMapMultiple
                    reviews={reviews}
                    zoom={15}
                    coordinates={coordinates}
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
