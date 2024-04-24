"use client";
import { BiBlock, BiChevronRight, BiFlag } from "react-icons/bi";
import Image from "next/image";
import thumbDown from "public/thumbDown.svg";
import thumbUp from "public/thumbUp.svg";
import {
  Review,
  ReviewStatus,
  getReviews,
  getSuspendedReviews,
} from "@/models/review";
import { ReviewStatusBadge } from "../atoms/ReviewStatusBadges";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import { useState } from "react";
import { ModalInfo } from "../molecules/ModalInfo";
import { Timestamp } from "firebase/firestore";

export default function SuspendedReviewsTable() {
  const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<Review>();

  const [paginationIndex, setPaginationIndex] = useState<number>(0);
  const [paginationTimes, setPaginationTimes] = useState<Timestamp[]>([]);

  const [startAfterTime, setStartAfterTime] = useState<Timestamp | null>(null);

  const { data: reviews, isFetching } = useQuery<Review[] | undefined, Error>({
    queryKey: ["suspended", startAfterTime],
    queryFn: () => getSuspendedReviews(),
  });

  // Handlers to go to the next or previous page
  const fetchNext = () => {
    if (reviews && reviews.length > 0) {
      const firstReview = reviews[0];
      // Add 1 second to the first review time in every page so we don't miss that review
      let firstReviewTime = firstReview.timeCreated.toDate();
      firstReviewTime.setSeconds(firstReviewTime.getSeconds() + 1);
      const time = Timestamp.fromDate(firstReviewTime);
      if (paginationTimes.length == paginationIndex)
        setPaginationTimes((prev) => [...prev, time]);
      const lastReview = reviews[reviews.length - 1];
      setStartAfterTime(lastReview.timeCreated);
      setPaginationIndex(paginationIndex + 1);
    }
  };

  const fetchPrev = () => {
    if (reviews && reviews.length > 0) {
      setPaginationIndex(paginationIndex - 1);
      setStartAfterTime(paginationTimes[paginationIndex - 1]);
    }
  };

  return (
    <div className="">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          {/* <BiBlock className="text-red-400 w-5 h-5 my-4 " /> */}

          <h1 className="text-base font-semibold leading-6 text-gray-900">
            <span>Suspended Reviews</span>
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the suspended reviews.
          </p>
        </div>
        {/* <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div> */}
      </div>
      <div className="mt-6 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Street
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900 whitespace-nowrap "
                    >
                      Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      User
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Opinion
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Created
                    </th>
                    <th scope="col" className="relative py-2 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">See more</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {isFetching || !reviews ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="flex justify-center items-center h-[446px] z-50 bg-white opacity-90">
                          <BounceLoader color="#d8b4fe" size={100} />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reviews.map((review) => (
                      <tr key={review.id}>
                        <td className="whitespace-nowrap py-2.5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {review.address.split(",")[0]}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                          {review.address.split(",")[1]}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                          {review.userId}
                        </td>

                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                          {review.data.opinion?.recomend ? (
                            <div className="p-1 w-6 rounded-full bg-green-100">
                              <Image
                                src={thumbUp}
                                width={20}
                                height={20}
                                alt="thumbUp"
                              />
                            </div>
                          ) : (
                            <div className="p-1 w-6 rounded-full bg-red-400">
                              <Image
                                src={thumbDown}
                                width={20}
                                height={20}
                                alt="thumbDown"
                              />
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500 max-w-52 overflow-x-hidden text-ellipsis">
                          {review.data.opinion?.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                          <ReviewStatusBadge
                            status={review.status as ReviewStatus}
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                          {review.timeCreated
                            .toDate()
                            .toLocaleDateString("en-US", {
                              day: "2-digit", // Display the day as a two-digit number
                              month: "short", // Display an abbreviated version of the month
                            })}
                        </td>
                        <td className="relative whitespace-nowrap py-2.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div
                            onClick={() => {
                              setSelectedReview(review);
                              setOpenMoreInfo(!openMoreInfo);
                            }}
                            className="text-secondary-500 cursor-pointer hover:text-secondary-300"
                          >
                            <BiChevronRight className="h-6 w-6" />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end px-4">
              <div className="flex w-min">
                <button
                  className="btn-primary-transparent-full disabled:text-gray-400"
                  onClick={fetchPrev}
                  disabled={paginationIndex == 0}
                >
                  Prev
                </button>
                <button
                  className="btn-primary-transparent-full disabled:text-gray-400"
                  onClick={fetchNext}
                  disabled={isFetching || reviews!.length < 10}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalInfo
        openMoreInfo={openMoreInfo}
        setOpenMoreInfo={setOpenMoreInfo}
        review={selectedReview!}
      />
    </div>
  );
}
