import { ApartmentLocation } from "@/components/atoms/ApartmentLocation";
import Image from "next/image";
import building from "../../../public/building.png";
import { useState } from "react";
import comillas from "../../../public/comillas.png";
import { Label } from "../atoms/Label";
import { ModalInfo } from "./ModalInfo";
import { useConfig } from "@/hooks/swr/useConfig";
import { useTranslations } from "next-intl";
import { Config, ConfigValue } from "@/models/types";
import { Review } from "@/models/review";

export const CommunityCard = ({
  review,
  className,
}: {
  review: Review;
  className?: string;
}) => {
  const { config } = useConfig();
  const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false);
  const t = useTranslations();
  const handleMoreInfo = () => {
    setOpenMoreInfo(!openMoreInfo);
  };

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
          <Label tittle={t("common.tipologiaResidentes")}>
            {review.data?.community?.buildingNeighborhood
              ?.map(
                (type: string) =>
                  (
                    config as Config | undefined
                  )?.reviewConfig.neighbors.buildingNeighborhood.find(
                    (t: ConfigValue) => t.value === type
                  )?.label
                /* config?.neighbors.buildingNeighborhood.find(
                    (t) => t.value === type
                  )?.label */
              )
              .join(", ")}
          </Label>

          <Label tittle={t("common.pisosTuristicos")}>
            {
              (
                config as Config | undefined
              )?.reviewConfig.neighbors.touristicApartments.find(
                (t) =>
                  t.value === review.data?.community?.touristicApartments
              )?.label
            }
          </Label>
          <Label tittle={t("common.relacionVecinal")}>
            {
              /* config? */ (
                config as Config | undefined
              )?.reviewConfig.neighbors.neighborsRelationship.find(
                (t) =>
                  t.value === review.data?.community?.neighborsRelationship
              )?.label
            }
          </Label>

          <Label tittle={t("common.estadoYMantenimiento")}>
            {
              (
                config as Config | undefined
              )?.reviewConfig.neighbors.buildingMaintenance.find(
                (t) =>
                  t.value === review.data?.community?.buildingMaintenance
              )?.label
            }
          </Label>
          <Label tittle={t("common.limpieza")}>
            {
              (
                config as Config | undefined
              )?.reviewConfig.neighbors.buildingCleaning.find(
                (t) => t.value === review.data?.community?.buildingCleaning
              )?.label
            }
          </Label>
          <Label tittle={t("common.services")}>
            {review.data?.community?.services
              ?.map(
                (type: string) =>
                  (
                    config as Config | undefined
                  )?.reviewConfig.neighbors.services.find(
                    (t) => t.value === type
                  )?.label
              )
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
