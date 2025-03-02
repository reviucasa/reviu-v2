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
import { useRouter } from "next/navigation";
import { getReviewUri } from "@/helpers/getReviewUri";

export const OpinionCardSmall = ({
  review,
  sizeCard,
  className,
  compressed = false,
}: {
  review: Review;
  sizeCard: number;
  className?: string;
  compressed?: boolean;
}) => {
  const router = useRouter();
  const [openModalInfo, setOpenModalInfo] = useState<boolean>(false);
  const [openReportInfo, setOpenReportInfo] = useState<boolean>(false);
  const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false);
  const t = useTranslations();

  return (
    <>
      <div
        style={{ width: `${sizeCard}px` }}
        key={review.id}
        className={`bg-[#FDFDFD] hover:bg-white hover:border-[#546E7A] flex flex-col justify-between border py-4 px-6 rounded-lg max-h-96 ${className}`}
      >
        <div
          className="cursor-pointer"
          onClick={() => {
            router.push(getReviewUri(review));
          }}
        >
          <div
            className={`flex items-start w-full justify-between ${
              compressed ? "pb-2 mb-2 " : "pb-4 mb-4 "
            } border-b-2 gap-6`}
          >
            <div className="flex-1 flex flex-col items-start justify-center ">
              <p>
                {review.address
                  .replace(", Espanya", "")
                  .replace(", España", "")}
              </p>
             {!compressed && <p className={"font-bold"}>
                {review?.apartment?.stair} {review?.apartment?.floor}{" "}
                {review?.apartment?.door}
              </p>}
            </div>
            <Chip
              className={`${compressed ? 'h-7 w-7' : 'h-8 w-8'} px-2 py-2 ${
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
            </Chip>
          </div>
          <div className={`flex justify-start ${compressed ? "pb-2" : "pb-4"}`}>
            <p className={`font-bold  ${compressed ? "text-base" : "text-lg"} text-ellipsis`}>
              {review.data?.opinion?.title}
            </p>
          </div>
          <div
            className={`flex flex-row justify-start ${
              !compressed && "h-20  mb-4"
            }  w-full gap-2`}
          >
            {review.data.opinion?.images &&
              review.data.opinion?.images
                .slice(0, 4)
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
        {!compressed && (
          <div className="relative border-t-2 pt-2 items-center flex justify-between">
            <div
              className=" text-primary-500 cursor-pointer text-sm md:text-base"
              onClick={() => {
                router.push(getReviewUri(review));
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
        )}
      </div>
      <DialogReport
        isOpen={openModalInfo}
        setIsOpen={setOpenModalInfo}
        reviewData={{
          id: review.id,
          userId: review.userId,
          address: review.address,
        }}
      />
      <ModalInfo
        openMoreInfo={openMoreInfo}
        setOpenMoreInfo={setOpenMoreInfo}
        review={review}
      />
    </>
  );
};
