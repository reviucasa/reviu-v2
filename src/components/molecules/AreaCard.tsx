import { ApartmentLocation } from "@/components/atoms/ApartmentLocation";
import Image from "next/image";
import location from "../../../public/iconLocation.png";
import { useState } from "react";
import comillas from "../../../public/comillas.png";
import { ModalInfo } from "./ModalInfo";
import { Review } from "@/models/review";

export const AreaCard = ({
  review,
  className,
}: {
  review: Review;
  className?: string;
}) => {
  const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false);

  return (
    <div
      className={`border border-gray-300 rounded-md p-4 pb-0 lg:p-0 ${className}`}
    >
      <div className="lg:py-4 lg:px-6">
        <div className="lg:flex hidden bg-gray-300 rounded-full h-8 w-8 items-center justify-center">
          <Image
            quality={100}
            src={location}
            width={16}
            height={16}
            alt="green house"
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row pb-6 border-b-2 lg:mx-6 gap-14">
        <div className="grid grid-cols-[1fr_auto] lg:w-1/3">
          <ApartmentLocation
            className="flex flex-col lg:gap-5 gap-3"
            review={review}
          />
          <div className="flex lg:hidden bg-gray-300 rounded-full h-8 w-8 items-center justify-center">
            <Image
              quality={100}
              src={location}
              width={16}
              height={16}
              alt="green house"
            />
          </div>
        </div>
        <div className="flex-1 gap-8">
          <div className="flex">
            <Image src={comillas} alt="20" className="h-fit" />
            <p className="flex pl-2 items-center text-sm md:text-base">
              {review.data?.community?.comment
                ? review.data?.community?.comment
                : "No han dejado comentario"}
            </p>
          </div>
        </div>
      </div>
      <div className="mx-6">
        <div
          className="py-2 text-primary-500 cursor-pointer"
          onClick={() => {
            setOpenMoreInfo(!openMoreInfo);
          }}
        >
          {"Ver mas >"}
        </div>
        <div></div>
      </div>
      {openMoreInfo && (
        <ModalInfo
          openMoreInfo={openMoreInfo}
          setOpenMoreInfo={setOpenMoreInfo}
          review={review}
        />
      )}
    </div>
  );
};
