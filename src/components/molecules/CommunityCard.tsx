import { ApartmentLocation } from "@/components/atoms/ApartmentLocation";
import Image from "next/image";
import building from "public/images/building.png";
import { useState } from "react";
import comillas from "public/images/comillas.png";
import { Label } from "../atoms/Label";
import { ModalInfo } from "./ModalInfo";
import { useTranslations } from "next-intl";
import { Review } from "@/models/review";
import { useRouter } from "next/navigation";
import { getReviewUri } from "@/helpers/getReviewUri";

export const CommunityCard = ({
  review,
  className,
}: {
  review: Review;
  className?: string;
}) => {
  const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false);
  const t = useTranslations();
  const router = useRouter();
  const handleMoreInfo = () => {
    router.push(getReviewUri(review));

    // setOpenMoreInfo(!openMoreInfo);
  };
  const config = useTranslations("config");

  return (
    <div
      className={`border border-gray-300 rounded-md p-4 pb-0 lg:p-0 ${className}`}
    >
      <div className="lg:py-4 lg:px-6">
        <div className="lg:flex hidden bg-gray-300 rounded-full h-8 w-8 items-center justify-center">
          <Image
            quality={100}
            src={building}
            width={16}
            height={16}
            alt="green house"
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row pb-6 lg:mx-6 border-b-2 gap-6">
        <div className="grid grid-cols-[1fr_auto] lg:w-1/3">
          <ApartmentLocation
            className="flex flex-col lg:gap-5 gap-3"
            review={review}
          />
          <div className="flex lg:hidden bg-gray-300 rounded-full h-8 w-8 items-center justify-center">
            <Image
              quality={100}
              src={building}
              width={16}
              height={16}
              alt="green house"
            />
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-8">
          <Label title={t("common.tipologiaResidentes")}>
            {review.data?.community?.buildingNeighborhood
              ?.map((type: string) =>
                config(`neighbors.buildingNeighborhood.${type}`)
              )
              .join(", ")}
          </Label>

          <Label title={t("common.pisosTuristicos")}>
            {config(
              `neighbors.touristicApartments.${review.data?.community?.touristicApartments}`
            )}
          </Label>
          <Label title={t("common.relacionVecinal")}>
            {config(
              `neighbors.neighborsRelationship.${review.data?.community?.neighborsRelationship}`
            )}
          </Label>

          <Label title={t("common.estadoYMantenimiento")}>
            {config(
              `neighbors.buildingMaintenance.${review.data?.community?.buildingMaintenance}`
            )}
          </Label>
          <Label title={t("common.limpieza")}>
            {config(
              `neighbors.buildingCleaning.${review.data?.community?.buildingCleaning}`
            )}
          </Label>
          <Label title={t("common.services")}>
            {review.data?.community?.services
              ?.map((type: string) => config(`neighbors.services.${type}`))
              .join(", ")}
          </Label>

          <div className="grid col-span-2">
            <div className="flex">
              {review.data?.community?.comment && (
                <>
                  <Image src={comillas} alt="20" className="h-fit" />
                  <p className="pl-2 text-sm md:text-base">
                    {review.data?.community?.comment}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-6">
        <div
          className="py-2 text-primary-500 cursor-pointer text-sm md:text-base"
          onClick={handleMoreInfo}
        >
          {t("common.verMás")}
          {""}
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
