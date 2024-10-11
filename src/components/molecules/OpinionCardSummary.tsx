"use client";
import { Chip } from "@/components/atoms/Chip";
import Image from "next/image";
import green_house from "public/images/green_house.png";
import { useState } from "react";
import thumbDown from "public/images/thumbDown.svg";
import thumbUp from "public/images/thumbUp.svg";
import { ApartmentLocation } from "../atoms/ApartmentLocation";
import { ModalInfo } from "./ModalInfo";
import { useTranslations } from "next-intl";
import { Review } from "@/models/review";
import { useRouter } from "next/navigation";
import { ApartmentLocationSummary } from "../atoms/ApartmentLocationSummary";

export const OpinionCardSummary = ({
  review,
  className,
  openInModal,
}: {
  review: Review;
  className?: string;
  openInModal?: boolean;
}) => {
  const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations();

  return (
    <div
      className={`relative border border-gray-300 rounded-md overflow-hidden ${className}`}
    >
      <div className="items-center w-full grid grid-rows">
        <Chip
          className={`text-xs flex items-center gap-2 rounded-none h-7 ${
            review.data?.opinion?.recomend
              ? "bg-lime text-primary-500"
              : "bg-red-500 text-white"
          }`}
        >
          {review.data?.opinion?.recomend ? (
            <Image src={thumbUp} width={16} height={16} alt="thumbUp" />
          ) : (
            <Image src={thumbDown} width={16} height={16} alt="thumbDown" />
          )}
          <p className="tracking-wider text-[10px]">
            {review?.data?.opinion?.recomend
              ? t("common.loRecomiendo")
              : t("common.noLoRecomiendo")}
          </p>
        </Chip>
      </div>
      <div className="flex flex-col px-3 py-4 border-b gap-4">
        <ApartmentLocationSummary className="flex flex-col" review={review} />
        <div className="">
          <span className="font-bold text-xs ">
            {review.data?.opinion?.title}
          </span>
        </div>
      </div>

      <div
        className="py-2 mx-3 text-primary-500 cursor-pointer text-sm "
        onClick={() => {
          if (!openInModal) {
            window.open(
              `/review/barcelona/${encodeURIComponent(
                review.address.split(", ")[0].replaceAll(" ", "-")
              )}/${review.address.split(", ")[1]}/${review.id}`
            );
          } else setOpenMoreInfo(!openMoreInfo);
        }}
      >
        {t("common.verMás")}
      </div>

      <ModalInfo
        openMoreInfo={openMoreInfo}
        setOpenMoreInfo={setOpenMoreInfo}
        review={review}
      />
    </div>
  );
};
