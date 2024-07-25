"use client";
import { BiCheck, BiX } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { User, UserStatus, UserType, getUsers } from "@/models/user";
import { UserStatusBadge } from "../atoms/UserStatusBadge";
import { UserTypeBadge } from "../atoms/UserTypeBadge";
import { DropDownUserOptions } from "./DropDownUserOptions";

export default function UsersTable() {
  const [paginationIndex, setPaginationIndex] = useState<number>(0);
  const [paginationTimes, setPaginationTimes] = useState<Timestamp[]>([]);

  const [startAfterTime, setStartAfterTime] = useState<Timestamp | null>(null);

  const {
    data: users,
    isFetching,
    refetch,
  } = useQuery<User[] | undefined, Error>({
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
      if (paginationTimes.length == paginationIndex)
        setPaginationTimes((prev) => [...prev, time]);
      const lastUser = users[users.length - 1];
      setStartAfterTime(lastUser.timeCreated);
      setPaginationIndex(paginationIndex + 1);
    }
  };

  const fetchPrev = () => {
    if (users && users.length > 0) {
      setPaginationIndex(paginationIndex - 1);
      setStartAfterTime(paginationTimes[paginationIndex - 1]);
    }
  };

  return (
    <div className="">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users registered in the app.
          </p>
        </div>
      </div>
      <div className="mt-6 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Uid
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900 whitespace-nowrap "
                    >
                      Name
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
                      <span className="sr-only">Make Admin</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {isFetching || !users ? (
                    <tr>
                      <td colSpan={10}>
                        <div className="flex justify-center items-center h-[446px] z-50 bg-white opacity-90">
                          <BounceLoader color="#d8b4fe" size={100} />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td
                          className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500 max-w-52 overflow-x-hidden text-ellipsis cursor-pointer hover:text-secondary-500 active:text-secondary-300"
                          onClick={() => {
                            navigator.clipboard.writeText(user.id);
                          }}
                        >
                          {user.id.slice(0, 3)}...{user.id.slice(-3)}
                        </td>
                        <td className="whitespace-nowrap py-2.5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {user.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500 max-w-52 overflow-x-hidden text-ellipsis">
                          {user.name + " " + user.lastname}
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
                        <td className="whitespace-nowrap py-2.5 pl-3 pr-4 text-sm sm:pr-6">
                          <DropDownUserOptions user={user} refetch={refetch} />
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
    </div>
  );
}
