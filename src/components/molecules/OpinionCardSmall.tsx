import { Chip } from "@/components/atoms/Chip";
import Image from "next/image";
import { useState } from "react";
import points from "public/images/3points.png";
import thumbDown from "public/images/thumbDown.svg";
import thumbUp from "public/images/thumbUp.svg";
import { Report } from "../atoms/Report";
import { DialogReport } from "./DialogReport";
import { ModalInfo } from "./ModalInfo";
import { useTranslations } from "next-intl";
import { Review } from "@/models/review";

export const OpinionCardSmall = ({
  review,
  sizeCard,
  className,
}: {
  review: Review;
  sizeCard: number;
  className?: string;
}) => {
  const [openModalInfo, setOpenModalInfo] = useState<boolean>(false);
  const [openReportInfo, setOpenReportInfo] = useState<boolean>(false);
  const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false);

  const t = useTranslations();

  return (
    <>
      <div
        style={{ width: `${sizeCard}px` }}
        key={review.id}
        className={`${className} hover:bg-[#F8F8F8] hover:border-[#546E7A] flex flex-col justify-between border py-6 px-8 rounded-lg h-full`}
      >
        <div
          className="cursor-pointer"
          onClick={() => {
            setOpenMoreInfo(!openMoreInfo);
          }}
        >
          <div className="flex items-start w-full justify-between pb-4 mb-4 border-b-2 gap-6">
            <div className="flex-1 flex flex-col  items-start justify-center ">
              <p>{review.address}</p>
              <p className="font-bold">
                {review?.apartment?.stair} {review?.apartment?.floor}{" "}
                {review?.apartment?.door}
              </p>
            </div>
            <Chip
              className={`h-10 w-10 px-2 py-2 ${
                review.data?.opinion?.recomend
                  ? "bg-lime text-primary-500"
                  : "bg-red-500 text-white"
              }`}
            >
              {review.data?.opinion?.recomend ? (
                <Image src={thumbUp} width={20} height={20} alt="thumbUp" />
              ) : (
                <Image src={thumbDown} width={20} height={20} alt="thumbDown" />
              )}
            </Chip>
          </div>
          <div className="flex pb-4 justify-start">
            <p className="font-bold text-xl text-ellipsis	">
              {review.data?.opinion?.title}
            </p>
          </div>
          <div className="flex flex-row justify-start h-20 w-full gap-2">
            {review.data.opinion?.images &&
              review.data.opinion?.images
                .slice(0, 6)
                .map((image, idx) => (
                  <Image
                    key={idx}
                    id={`image-preview-${idx}`}
                    src={image.url}
                    width={80}
                    height={80}
                    className="rounded-md object-cover border border-gray-200 w-12 h-20"
                    alt="selected image"
                  />
                ))}
          </div>
        </div>
        <div className="relative border-t-2 pt-2 items-center flex justify-between">
          <div
            className=" text-primary-500 cursor-pointer text-sm md:text-base"
            onClick={() => {
              setOpenMoreInfo(!openMoreInfo);
              // router.push({
              //   pathname: `/detail/${review.buildingId}`,
              //   query: { reviewId: review.id }
              // })
            }}
          >
            {t("common.verMás")}
          </div>
          <div
            className="flex items-center w-8 justify-end cursor-pointer"
            onClick={() => {
              setOpenReportInfo(!openReportInfo);
            }}
          >
            <div
              className={`${
                openReportInfo && "bg-gray-300"
              } rounded-full h-8 w-12 flex items-center justify-center `}
            >
              <Image
                quality={100}
                src={points}
                width={4}
                alt={"Icono reportar comentario"}
              />
            </div>
            {openReportInfo && (
              <Report
                className="absolute"
                onAction={() => {
                  setOpenModalInfo(!openModalInfo);
                  setOpenReportInfo(!openReportInfo);
                }}
              />
            )}
          </div>
        </div>
      </div>
      <DialogReport
        isOpen={openModalInfo}
        setIsOpen={setOpenModalInfo}
        reviewId={review.id}
      />
      <ModalInfo
        openMoreInfo={openMoreInfo}
        setOpenMoreInfo={setOpenMoreInfo}
        review={review}
      />
    </>
  );
};
