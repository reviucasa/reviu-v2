"use client";
import { useState } from "react";
import { Button } from "../atoms/Button";
import { Dialog } from "../atoms/Dialog";
import { deleteReview, suspendReview } from "@/models/review";
import { BiBlock, BiTrash } from "react-icons/bi";
import { useRouter } from "next/navigation";

export const DialogDelete = ({
  isOpen,
  setIsOpen,
  reviewId,
}: {
  isOpen: boolean;
  setIsOpen?: any;
  reviewId: string;
}) => {
  const router = useRouter();
  const [selectedAction, setSelectedAction] = useState("");

  const handleSuspend = async () => {
    await suspendReview(reviewId);
    router.refresh();
  };

  const handleDelete = async () => {
    await deleteReview(reviewId);
    router.refresh();
  };

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={() => {
        setIsOpen(!isOpen);
      }}
      className="w-[700px] border border-gray-500"
    >
      <div className="lg:h-[500px] h-[500px] grid">
        <h5 className="lg:text-2xl text-base ">Suspend or Delete Review</h5>
        <p className="mb-6 lg:text-base text-sm">
          Proceed with caution. Suspend will hide the review from public view,
          while Delete will permanently remove it.
        </p>
        <div
          className={"bg-white"}
          onClick={() => {
            setSelectedAction("suspend");
          }}
        >
          <div
            className={`p-4 border border-gray-300 rounded-md cursor-pointer ${
              selectedAction == "suspend"
                ? "border bg-red-50 border-red-500"
                : "bg-gray-50"
            }`}
          >
            <div className="grid grid-cols-[1fr_auto] leading-6">
              <p className="text-gray-500 font-bold lg:text-base text-sm">
                Suspend Review
              </p>

              <BiBlock className="w-5 h-5 text-red-500" />

              <div className="lg:text-base text-sm">
                Temporarily remove the review from public view. The review will
                not be deleted and will remain accessible from the admin
                interface for future reference or actions. This action is
                typically used for reviews that violate community guidelines or
                require further assessment.
              </div>
            </div>
          </div>
        </div>
        <div
          className={"mt-2"}
          onClick={() => {
            setSelectedAction("delete");
          }}
        >
          <div
            className={`p-4 border border-gray-300 rounded-md cursor-pointer  ${
              selectedAction == "delete"
                ? " bg-red-50 border-red-500"
                : "bg-gray-50"
            }`}
          >
            <div className="grid grid-cols-[1fr_auto] leading-6">
              <p className="text-red-500 font-bold lg:text-base text-sm">
                Delete Review
              </p>

              <BiTrash className="w-5 h-5 text-red-500" />

              <div className="lg:text-base text-sm">
                Permanently delete the review. This action is typically used for
                reviews that contain inappropriate content, violate terms of
                service, or are otherwise irredeemable.
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-8 gap-4">
          <p className="underline lg:text-base text-sm cursor-pointer">
            Reach out to the technical team in case of doubt
          </p>

          <Button
            buttonClassName="btn-remove-bordered content-center overflow-hidden"
            disabled={!selectedAction}
            onClick={() => {
              if (selectedAction == "suspend") {
                handleSuspend();
              } else {
                handleDelete();
              }
              setIsOpen(!isOpen);
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
