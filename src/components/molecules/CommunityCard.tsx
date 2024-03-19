import { ApartmentLocation } from "@/components/atoms/AparmentLocation";
import Image from "next/image";
import building from "../../../public/building.png";
import { useState } from "react";
import comillas from "../../../public/comillas.png";
import { Label } from "../atoms/Label";
import { ModalInfo } from "./ModalInfo";
import { useConfig } from "@/hooks/swr/useConfig";
import { useTranslations } from "next-intl";
import { Config, ConfigValue, ReviewData } from "@/models/types";

export const CommunityCard = ({
  review,
  className,
}: {
  review: ReviewData;
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
            {review.review?.community?.building_neighborhood
              ?.map(
                (type: string) =>
                  (
                    config as Config | undefined
                  )?.review_config.neighbors.building_neighborhood.find(
                    (t: ConfigValue) => t.value === type
                  )?.label
                /* config?.neighbors.building_neighborhood.find(
                    (t) => t.value === type
                  )?.label */
              )
              .join(", ")}
          </Label>

          <Label tittle={t("common.pisosTuristicos")}>
            {
              (
                config as Config | undefined
              )?.review_config.neighbors.touristic_apartments.find(
                (t) =>
                  t.value === review.review?.community?.touristic_apartments
              )?.label
            }
          </Label>
          <Label tittle={t("common.relacionVecinal")}>
            {
              /* config? */ (
                config as Config | undefined
              )?.review_config.neighbors.neighbors_relationship.find(
                (t) =>
                  t.value === review.review?.community?.neighbors_relationship
              )?.label
            }
          </Label>

          <Label tittle={t("common.estadoYMantenimiento")}>
            {
              (
                config as Config | undefined
              )?.review_config.neighbors.building_maintenance.find(
                (t) =>
                  t.value === review.review?.community?.building_maintenance
              )?.label
            }
          </Label>
          <Label tittle={t("common.limpieza")}>
            {
              (
                config as Config | undefined
              )?.review_config.neighbors.building_cleaning.find(
                (t) => t.value === review.review?.community?.building_cleaning
              )?.label
            }
          </Label>
          <Label tittle={t("common.services")}>
            {review.review?.community?.services
              ?.map(
                (type: string) =>
                  (
                    config as Config | undefined
                  )?.review_config.neighbors.services.find(
                    (t) => t.value === type
                  )?.label
              )
              .join(", ")}
          </Label>

          <div className="grid col-span-2">
            <div className="flex">
              {review.review?.community?.comment && (
                <>
                  <Image src={comillas} alt="20" className="h-fit" />
                  <p className="pl-2 text-sm md:text-base">
                    {review.review?.community?.comment}
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
