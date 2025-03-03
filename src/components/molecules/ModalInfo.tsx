"use client";
import { Review } from "@/models/review";
import { DialogDrawer } from "../atoms/DialogDrawer";
import { ReviewDetail } from "../organism/ReviewDetail";
import { useEffect, useState } from "react";

export const ModalInfo = ({
  review,
  openMoreInfo,
  setOpenMoreInfo,
}: {
  review: Review;
  openMoreInfo: boolean;
  setOpenMoreInfo: (value: boolean) => void;
}) => {
  return (
    <DialogDrawer
      iconClose
      isOpen={openMoreInfo}
      setIsOpen={setOpenMoreInfo}
      className="h-full absolute right-0 lg:w-3/4 w-full rounded-none"
    >
      <ReviewDetail review={review} />
    </DialogDrawer>
  );
};
