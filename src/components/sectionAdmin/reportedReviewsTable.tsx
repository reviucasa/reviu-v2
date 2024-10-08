"use client";
import { BiChevronRight, BiExpandAlt } from "react-icons/bi";
import { Review, getReview } from "@/models/review";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import { useCallback, useState } from "react";
import { ModalInfo } from "../molecules/ModalInfo";
import { ReviewReport, getReviewReports } from "@/models/report";
import { UserTypeBadge } from "../atoms/UserTypeBadge";
import { DialogReviewReport } from "../molecules/DialogReviewReport";

export default function ReportedReviewsTable() {
  const [openReviewReportDialog, setOpenReviewReportDialog] =
    useState<boolean>(false);
  const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<ReviewReport>();
  const [reportReview, setReportReview] = useState<Review>();

  const [paginationIndex, setPaginationIndex] = useState<number>(0);

  const {
    data: reports,
    isFetching,
    refetch,
  } = useQuery<ReviewReport[] | undefined, Error>({
    queryKey: ["reports"],
    queryFn: () => getReviewReports(),
  });

  const onReportSelected = useCallback(async (reviewId: string) => {
    const review = await getReview(reviewId);
    setReportReview(review);
    setOpenMoreInfo(true);
  }, []);

  return (
    <div className="">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Reported Reviews
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the reported reviews.
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
                      className="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Issuer
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      User Type
                    </th>
                    {/* <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Review Id
                    </th> */}
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Review
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Reason
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Comment
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Owner
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Created
                    </th>
                    <th scope="col" className="relative py-2 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">See report</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {isFetching || !reports ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="flex justify-center items-center h-[446px] z-50 bg-white opacity-90">
                          <BounceLoader color="#d8b4fe" size={100} />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reports
                      .slice(paginationIndex * 6, (paginationIndex + 1) * 6)
                      .map((report) => {
                        return (
                          <tr key={report.id}>
                            <td
                              className="whitespace-nowrap py-2.5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 cursor-pointer hover:text-secondary-500 active:text-secondary-300"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  report.issuer.email
                                );
                              }}
                            >
                              {report.issuer.email}
                            </td>
                            <td className="whitespace-nowrap py-2.5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              <UserTypeBadge type={report.issuer.type} />
                            </td>
                            {/* <td
                              className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500 max-w-52 overflow-x-hidden text-ellipsis cursor-pointer hover:text-secondary-500 active:text-secondary-300"
                              onClick={() => {
                                navigator.clipboard.writeText(report.review.id);
                              }}
                            >
                              {report.review.id.slice(0, 3)}...
                              {report.review.id.slice(-3)}
                            </td> */}
                            <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                              <div
                                onClick={() => {
                                  onReportSelected(report.review.id);
                                }}
                                className="text-primary-300 cursor-pointer hover:underline"
                              >
                                See review
                                {/* {report.reviewId} */}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                              {report.reason}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500 max-w-64 overflow-x-hidden text-ellipsis">
                              {report.comment}
                            </td>
                            <td
                              className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500 max-w-44 overflow-x-hidden text-ellipsis cursor-pointer hover:text-secondary-500 active:text-secondary-300"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  report.issuer.email
                                );
                              }}
                            >
                              {report.reviewer.email}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                              {report.timeCreated
                                .toDate()
                                .toLocaleDateString("en-US", {
                                  day: "2-digit", // Display the day as a two-digit number
                                  month: "short", // Display an abbreviated version of the month
                                })}
                            </td>
                            <td className="relative whitespace-nowrap py-2.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <div
                                onClick={() => {
                                  setSelectedReport(report);
                                  setOpenReviewReportDialog(true);
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
                  onClick={() => {
                    setPaginationIndex(paginationIndex - 1);
                  }}
                  disabled={paginationIndex == 0}
                >
                  Prev
                </button>
                <button
                  className="btn-primary-transparent-full disabled:text-gray-400"
                  onClick={() => {
                    setPaginationIndex(paginationIndex + 1);
                  }}
                  disabled={isFetching || (reports && reports!.length < 10)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedReport && (
        <DialogReviewReport
          isOpen={openReviewReportDialog}
          setIsOpen={setOpenReviewReportDialog}
          report={selectedReport}
          refetch={refetch}
        />
      )}
      <ModalInfo
        openMoreInfo={openMoreInfo}
        setOpenMoreInfo={setOpenMoreInfo}
        review={reportReview!}
      />
    </div>
  );
}
