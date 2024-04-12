"use client";
import { BiCheck, BiChevronRight, BiX } from "react-icons/bi";
import Image from "next/image";
import thumbDown from "../../../public/thumbDown.svg";
import thumbUp from "../../../public/thumbUp.svg";
import { Review, ReviewStatus, getReviews } from "@/models/review";
import { ReviewStatusBadge } from "../atoms/ReviewStatusBadges";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import { useState } from "react";
import { ModalInfo } from "../molecules/ModalInfo";
import { Timestamp } from "firebase/firestore";
import { User, UserStatus, UserType, getUsers } from "@/models/user";
import { UserStatusBadge } from "../atoms/UserStatusBadge";
import { UserTypeBadge } from "../atoms/UserTypeBadge";

export default function UsersTable() {
  const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<Review>();

  const [paginationIndex, setPaginationIndex] = useState<number>(0);
  const [paginationTimes, setPaginationTimes] = useState<Timestamp[]>([]);

  const [startAfterTime, setStartAfterTime] = useState<Timestamp | null>(null);

  const { data: users, isFetching } = useQuery<User[] | undefined, Error>({
    queryKey: ["users", startAfterTime],
    queryFn: () => getUsers({ count: 10, startAfterTime }),
  });

  // Handlers to go to the next or previous page
  const fetchNext = () => {
    if (users && users.length > 0) {
      const firstUser = users[0];
      // Add 1 second to the first user in every page so we don't miss that user
      let firstReviewTime = firstUser.timeCreated.toDate();
      firstReviewTime.setSeconds(firstReviewTime.getSeconds() + 1);
      const time = Timestamp.fromDate(firstReviewTime);

      setPaginationIndex(paginationIndex + 1);
      setPaginationTimes((prev) => [...prev, time]);
      const lastUser = users[users.length - 1];
      setStartAfterTime(lastUser.timeCreated);
    }
  };

  const fetchPrev = () => {
    if (users && users.length > 0) {
      setPaginationIndex(paginationIndex - 1);
      setStartAfterTime(paginationTimes[paginationIndex]);
    }
  };

  return (
    <div className="">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Reviews
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the reviews registered in the app.
          </p>
        </div>
      </div>
      <div className="mt-6 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900 whitespace-nowrap "
                    >
                      Last name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Birthday
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Country
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      T&C
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Subs
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Type
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
                  {isFetching || !users ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="flex justify-center items-center h-[446px] z-50 bg-white opacity-90">
                          <BounceLoader color="#d8b4fe" size={140} />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap py-2.5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {user.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                          {user.lastname}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                          {user.birthday}
                        </td>

                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                          {user.country}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500 max-w-52 overflow-x-hidden text-ellipsis">
                          {user.acceptedTerms ? (
                            <BiCheck className="text-green-500 w-5 h-5" />
                          ) : (
                            <BiX className="text-gray-500 w-5 h-5" />
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500 max-w-52 overflow-x-hidden text-ellipsis">
                          {user.subscribedToNewsletter ? (
                            <BiCheck className="text-green-500 w-5 h-5" />
                          ) : (
                            <BiX className="text-gray-500 w-5 h-5" />
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                          <UserTypeBadge type={user.type as UserType} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                          <UserStatusBadge status={user.status as UserStatus} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                          {user.timeCreated
                            .toDate()
                            .toLocaleDateString("en-US", {
                              day: "2-digit", // Display the day as a two-digit number
                              month: "short", // Display an abbreviated version of the month
                            })}
                        </td>
                        <td className="relative whitespace-nowrap py-2.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div
                            onClick={() => {
                              /* setSelectedReview(review);
                              setOpenMoreInfo(!openMoreInfo); */
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
                  disabled={isFetching || users!.length < 10}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <ModalInfo
        openMoreInfo={openMoreInfo}
        setOpenMoreInfo={setOpenMoreInfo}
        review={selectedReview!}
      /> */}
    </div>
  );
}
