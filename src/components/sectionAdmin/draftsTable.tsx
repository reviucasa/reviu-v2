"use client";
import { BiChevronRight } from "react-icons/bi";
import { Review, getDraftsCount, getDraftsWithUser } from "@/models/review";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import { useState } from "react";
import { User } from "@/models/user";
import { steps } from "@/staticData";
import { DialogDrawer } from "../atoms/DialogDrawer";
import CopyToClipboard from "../atoms/CopyToClipboard";
import { formatFirebaseTimestamp } from "@/helpers/formatTimestamp";

export default function DraftsTable() {
  const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<Review>();

  const [paginationIndex, setPaginationIndex] = useState<number>(0);
  const [paginationDocIds, setPaginationDocIds] = useState<string[]>([]);

  const [startAfterDocId, setStartAfterDocId] = useState<string | null>(null);

  const { data, isFetching } = useQuery<
    { drafts: Review[]; users: User[]; count: number } | undefined,
    Error
  >({
    queryKey: ["draftsWithUser", startAfterDocId],
    queryFn: () => getDraftsWithUser({ count: 10, startAfterDocId }),
  });

  // Handlers to go to the next or previous page
  const fetchNext = () => {
    if (data && data.drafts.length > 0) {
      const lastReview = data.drafts[data.drafts.length - 1];
      if (paginationDocIds.length === paginationIndex) {
        setPaginationDocIds((prev) => [...prev, lastReview.id]);
      }
      setStartAfterDocId(lastReview.id);
      setPaginationIndex(paginationIndex + 1);
    }
  };

  const fetchPrev = () => {
    if (paginationIndex > 0) {
      const prevIndex = paginationIndex - 1;
      setPaginationIndex(prevIndex);
      setStartAfterDocId(
        prevIndex === 0 ? null : paginationDocIds[prevIndex - 1]
      );
    }
  };

  return (
    <div className="">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Pending Drafts {data?.count && " - " + data.count}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the review drafts.
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
                      Draft Id
                    </th>
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
                      Step
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
                  {isFetching || !data?.drafts ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="flex justify-center items-center h-[446px] z-50 bg-white opacity-90">
                          <BounceLoader color="#d8b4fe" size={100} />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.drafts.map((d) => {
                      const user = data.users.find((u) => u.id == d.userId);

                      return (
                        <tr key={d.id}>
                          <td className="whitespace-nowrap px-4 py-2.5 text-sm text-gray-500 max-w-52 overflow-x-hidden">
                            <CopyToClipboard textToCopy={d.id}>
                              {`${d.id.slice(0, 3)}...${d.id.slice(-3)}`}
                            </CopyToClipboard>
                          </td>
                          <td className="whitespace-nowrap py-2.5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {d.address?.split(",")[0]}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                            {d.address?.split(",")[1]}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500 ">
                            <CopyToClipboard
                              textToCopy={user ? user.email : d.userId}
                            >
                              {user ? user.email : d.userId}
                            </CopyToClipboard>
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500 max-w-52 overflow-x-hidden text-ellipsis">
                            {d!.data!.step!}. {steps[d!.data!.step!].label}
                          </td>

                          <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500 max-w-52 overflow-x-hidden text-ellipsis">
                            {d.timeCreated
                              ? formatFirebaseTimestamp(d.timeCreated, "en")
                              : ""}
                          </td>

                          <td className="relative whitespace-nowrap py-2.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div
                              onClick={() => {
                                setSelectedReview(d);
                                setOpenMoreInfo(!openMoreInfo);
                              }}
                              className="text-secondary-500 cursor-pointer hover:text-secondary-300"
                            >
                              <BiChevronRight className="h-6 w-6" />
                            </div>
                          </td>
                        </tr>
                      );
                    })
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
                  disabled={
                    isFetching || (data?.drafts && data.drafts!.length < 10)
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogDrawer
        iconClose
        isOpen={openMoreInfo}
        setIsOpen={setOpenMoreInfo}
        className="h-full absolute right-0 lg:w-3/4 w-full rounded-none"
      >
        <div className="p-20">
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {JSON.stringify(selectedReview, null, 2)}
          </pre>
        </div>
      </DialogDrawer>
    </div>
  );
}
