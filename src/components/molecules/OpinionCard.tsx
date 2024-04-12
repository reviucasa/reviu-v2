import { Chip } from "@/components/atoms/Chip";
import Image from "next/image";
import green_house from "public/green_house.png";
import happy from "public/happy.png";
import sad from "public/sad.png";
import { useState } from "react";
import points from "public/3points.png";
import thumbDown from "public/thumbDown.svg";
import thumbUp from "public/thumbUp.svg";
import { ApartmentLocation } from "../atoms/ApartmentLocation";
import { Report } from "../atoms/Report";
import { DialogReport } from "./DialogReport";
import { ModalInfo } from "./ModalInfo";
import { useTranslations } from "next-intl";
import { Review } from "@/models/review";

export const OpinionCard = ({
  review,
  className,
}: {
  review: Review;
  className?: string;
}) => {
  const [openModalInfo, setOpenModalInfo] = useState<boolean>(false);
  const [openReportInfo, setOpenReportInfo] = useState<boolean>(false);
  const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false);

  const t = useTranslations();

  return (
    <div
      className={`relative border border-gray-300 rounded-md overflow-hidden ${className}`}
    >
      <div className="lg:flex items-center lg:py-4 lg:px-6 w-full lg:justify-between grid grid-rows">
        <div className="bg-gray-300 rounded-full h-8 w-8 lg:flex hidden items-center justify-center ">
          <Image
            quality={100}
            src={green_house}
            width={16}
            height={16}
            alt="green house"
          />
        </div>
        <Chip
          className={`text-xs flex px-3 items-center gap-2 rounded-none lg:rounded-full h-10 ${
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
          <p className="tracking-wider font-bold">{`${
            review.data?.opinion?.recomend ? "" : "NO"
          } ${t("common.loRecomiendo")}`}</p>
        </Chip>
      </div>

      <div className="flex flex-col lg:flex-row lg:mx-6 lg:p-0 px-4 py-6 border-b-2 gap-6">
        <div className="grid grid-cols-[1fr_auto] lg:w-1/3">
          <ApartmentLocation
            className="flex flex-col lg:gap-5 gap-3"
            review={review}
          />
          <div className="bg-gray-300 rounded-full h-8 w-8  flex items-center justify-center lg:hidden lg:order-first order-last">
            <Image
              quality={100}
              src={green_house}
              width={16}
              height={16}
              alt="green house"
            />
          </div>
        </div>
        <div className="flex-1">
          <span className="font-bold text-sm md:text-base">
            {review.data?.opinion?.title}
          </span>
          <div className="flex flex-col lg:gap-6 gap-4 lg:mt-8 mt-4 lg:mb-6">
            <div className="flex align-top gap-4 ">
              <div className="w-8 h-8 lg:order-first order-last">
                <Image
                  quality={100}
                  src={happy}
                  width={32}
                  height={32}
                  alt="Comentario positivo"
                />
              </div>
              <span className="flex-1 text-sm md:text-base">
                {review.data?.opinion?.positive}
              </span>
            </div>
            <div className="flex align-top gap-4 ">
              <div className="w-8 h-8 lg:order-first order-last">
                <Image
                  quality={100}
                  src={sad}
                  width={32}
                  height={32}
                  alt="Comentario negativo"
                />
              </div>
              <div className="flex-1 text-sm md:text-base">
                {review.data?.opinion?.negative}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex justify-between mx-6">
        <div
          className="py-2 text-primary-500 cursor-pointer text-sm md:text-base"
          onClick={() => {
            setOpenMoreInfo(!openMoreInfo);
            setOpenReportInfo(false);
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
            } rounded-full h-8 w-12 lg:flex hidden items-center justify-center `}
          >
            <Image
              quality={100}
              src={points}
              width={4}
              alt={"Icono reportar comentario"}
            />
          </div>
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
      <DialogReport
        isOpen={openModalInfo}
        setIsOpen={setOpenModalInfo}
        reviewId={review.id}
      />
      {
        <ModalInfo
          openMoreInfo={openMoreInfo}
          setOpenMoreInfo={setOpenMoreInfo}
          review={review}
        />
      }
    </div>
  );
};
