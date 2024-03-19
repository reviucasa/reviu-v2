import Image from "next/image";
import { useRouter } from "next/router";
import happy from "../../../public/happy.png";
import sad from "../../../public/sad.png";
import { useContext, useState } from "react";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import comillas from "../../../public/comillas.png";
import GreenHouse from "../../../public/green_house.png";
import { ApartmentLocation } from "../atoms/ApartmentLocation";
import { Chip } from "../atoms/Chip";
import { Label } from "../atoms/Label";
import { Report } from "../atoms/Report";
import { DialogReport } from "../molecules/DialogReport";
import { useTranslations } from "next-intl";
import { useConfig } from "@/hooks/swr/useConfig";
import { Config, ReviewData } from "@/models/types";
import { AnalisisContext } from "@/context/AnalisisSectionActive";

export const ReviewDetail = ({
  review,
}: {
  review: ReviewData;
  openMoreInfo: boolean;
  setOpenMoreInfo: (value: boolean) => void;
}) => {
  const t = useTranslations();
  const { config } = useConfig();
  const router = useRouter();
  const { wordCloud } = useContext(AnalisisContext);
  const vibe = wordCloud?.find((name) => name.group === "vibe")?.words;
  const services = wordCloud?.find((name) => name.group === "services")?.words;
  const [openModalInfo, setOpenModalInfo] = useState<boolean>(false);

  return (
    <div>
      {review && (
        <>
          <div className="bg-white grid lg:grid-cols-[auto_1fr] grid-col border-b-2 mb-10 md:gap-10 gap-5">
            <div className="lg:hidden flex-1  top-0 h-14  bg-white justify-start flex items-center	">
              <h6 className="font-bold">{t("common.detalleOpinion")}</h6>
            </div>
            <div className="lg:border-none border border-gray-300 rounded-md ">
              <Chip
                className={`flex lg:hidden text-xs rounded-none items-center gap-3 h-10 ${
                  review?.review?.opinion?.recomend
                    ? "bg-lime text-primary-500"
                    : "bg-red-500 text-white"
                }`}
              >
                {review?.review?.opinion?.recomend ? (
                  <FaRegThumbsUp size={17} />
                ) : (
                  <FaRegThumbsDown size={17} />
                )}
                {`${review?.review?.opinion?.recomend ? "" : "NO"} ${t(
                  "common.loRecomiendo"
                )}`}
              </Chip>
              <div className="lg:mt-3 mt-0 lg:p-0 p-4 overflow-hidden sticky top-10">
                <div className="lg:flex lg:flex-col lg:justify-end lg:pb-4 lg:sticky top-5 grid grid-cols-[1fr_auto]">
                  <div className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center lg:order-first order-last">
                    <Image
                      quality={100}
                      src={GreenHouse}
                      width={16}
                      height={16}
                      alt="green house"
                    />
                  </div>
                  <ApartmentLocation
                    className="lg:w-72 flex flex-col lg:gap-5 gap-2 lg:mt-4"
                    review={review}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-end pb-4 relative top-5">
                <Chip
                  className={`text-xs lg:flex hidden items-center gap-3 h-10 ${
                    review?.review?.opinion?.recomend
                      ? "bg-lime text-primary-500"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {review?.review?.opinion?.recomend ? (
                    <FaRegThumbsUp size={17} />
                  ) : (
                    <FaRegThumbsDown size={17} />
                  )}
                  {`${review?.review?.opinion?.recomend ? "" : "NO"} ${t(
                    "common.loRecomiendo"
                  )} `}
                </Chip>
              </div>
              <div className="border-b-2 lg:mb-8 mb-4 mt-4">
                <h6 className="mb-2 lg:text-xl font-bold">
                  {t("common.opinion")}
                </h6>
              </div>
              <div className="flex-1 mb-10">
                <span className="font-bold text-sm md:text-base">
                  {review?.review?.opinion?.title}
                </span>
                <div className="flex flex-col lg:gap-6 gap-4 lg:mt-8 mt-4 mb-6">
                  <span className="flex align-top gap-4">
                    <div className="w-8 h-8">
                      <Image
                        quality={100}
                        src={happy}
                        width={32}
                        height={32}
                        alt={t("common.comentarioPositivo")}
                      />
                    </div>
                    <span className="flex-1 text-sm md:text-base">
                      {review?.review?.opinion?.positive}
                    </span>
                  </span>
                  <span className="flex align-top gap-4">
                    <div className="w-8 h-8">
                      <Image
                        quality={100}
                        src={sad}
                        width={32}
                        height={32}
                        alt={t("common.comentarioNegativo")}
                      />
                    </div>
                    <div className="flex-1 text-sm md:text-base">
                      {review?.review?.opinion?.negative}
                    </div>
                  </span>
                </div>
              </div>
              <div className="border-b-2 lg:mb-8 mb-4 mt-4">
                <h6 className="mb-2 lg:text-xl font-bold">
                  {t("common.valoracion")}
                </h6>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-8 mb-10">
                <Label tittle={t("common.temperaturaVerano")}>
                  {
                    (
                      config as Config | undefined
                    )?.review_config.building_quality.summer_temperature.find(
                      (t) =>
                        t.value ===
                        review?.review?.valuation?.summer_temperature
                    )?.label
                  }
                </Label>
                <Label tittle={t("common.temperaturaInvierno")}>
                  {
                    /* (
                      config as Config | undefined
                    )?.review_config */ (
                      config as Config | undefined
                    )?.review_config.building_quality.winter_temperature.find(
                      (t) =>
                        t.value ===
                        review?.review?.valuation?.winter_temperature
                    )?.label
                  }
                </Label>
                <Label tittle={t("common.relacionVecinal")}>
                  {
                    (
                      config as Config | undefined
                    )?.review_config.neighbors.neighbors_relationship.find(
                      (t) =>
                        t.value ===
                        review.review?.community?.neighbors_relationship
                    )?.label
                  }
                </Label>
                <Label tittle={t("common.luz")}>
                  {
                    (
                      config as Config | undefined
                    )?.review_config.building_quality.light.find(
                      (t) => t.value === review.review?.valuation?.light
                    )?.label
                  }
                </Label>

                <Label tittle={t("common.estadoYMantenimiento")}>
                  {
                    (
                      config as Config | undefined
                    )?.review_config.neighbors.building_maintenance.find(
                      (t) =>
                        t.value ===
                        review?.review?.community?.building_maintenance
                    )?.label
                  }
                </Label>
                <Label tittle={t("common.services")}>
                  {review?.review?.community?.services
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
              </div>
              <div className="border-b-2 lg:mb-8 mb-4 mt-4">
                <h6 className="mb-2 lg:text-xl font-bold">
                  {t("common.gestion")}
                </h6>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-8">
                {review?.review?.management?.is_real_state_agency && (
                  <>
                    <div className="flex flex-col gap-2 text-sm md:text-base">
                      <label>{t("common.inmobiliaria")}</label>
                      {review.review.management.real_state_agency_id ? (
                        <a
                          className="text-sm md:text-base cursor-pointer text-secondary-500 font-semibold"
                          onClick={() => {
                            router.push(
                              `/realstate/${review.review.management?.real_state_agency_id}`
                            );
                          }}
                        >
                          {review.review?.management?.real_state_agency}
                        </a>
                      ) : (
                        <span>
                          {review.review?.management?.real_state_agency}
                        </span>
                      )}
                    </div>
                    <Label tittle={t("realstate:comoHaSidoElTrato")}>
                      {
                        (
                          config as Config | undefined
                        )?.review_config.landlord.landlord_treatment.find(
                          (t) =>
                            t.value ===
                            review.review?.management?.real_state_dealing
                        )?.label
                      }
                    </Label>
                  </>
                )}
                <Label tittle={t("common.tratoCasero")}>
                  {
                    (
                      config as Config | undefined
                    )?.review_config.landlord.landlord_treatment.find(
                      (t) =>
                        t.value === review.review?.management?.landlord_dealing
                    )?.label
                  }
                </Label>
                <Label tittle={t("common.respuestaProblema")}>
                  {
                    (
                      config as Config | undefined
                    )?.review_config.landlord.problem_solving.find(
                      (t) =>
                        t.value === review.review?.management?.problem_solving
                    )?.label
                  }
                </Label>
                <Label tittle={t("common.devolvieronFianza")}>
                  {
                    (
                      config as Config | undefined
                    )?.review_config.landlord.deposit.find(
                      (t) => t.value === review.review?.management?.deposit
                    )?.label
                  }
                </Label>
              </div>

              <div className="flex flex-col gap-6 my-8">
                {review?.review?.management?.is_real_state_agency && (
                  <div className="flex flex-col">
                    <div className="flex gap-4">
                      <Image src={comillas} alt="20" className="h-fit" />
                      <div>
                        <p className="font-bold text-sm md:text-base">
                          {t("common.consejosInmobiliaria")}
                        </p>
                        <p className="text-sm md:text-base">
                          {review.review?.management?.advice_real_state}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="flex gap-4">
                    <Image src={comillas} alt="20" className="h-fit" />
                    <div>
                      <p className="font-bold text-sm md:text-base">
                        {t("common.consejosCasero")}
                      </p>
                      <p className="text-sm md:text-base">
                        {review?.review?.management?.advice_landlord}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {review &&
                review.review &&
                review.review.community &&
                Object.keys(review.review.community).length > 0 && (
                  <>
                    <div className="border-b-2 mb-8 mt-10">
                      <h6 className="mb-2 lg:text-xl font-bold">
                        {t("common.comunidadVecinos")}
                      </h6>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-8">
                      <Label tittle={t("common.tipologiaResidentes")}>
                        {review.review?.community?.building_neighborhood
                          ?.map(
                            (type: string) =>
                              (
                                config as Config | undefined
                              )?.review_config.neighbors.building_neighborhood.find(
                                (t) => t.value === type
                              )?.label
                          )
                          .join(", ")}
                      </Label>

                      <Label tittle={t("common.pisosTuristicos")}>
                        {
                          (
                            config as Config | undefined
                          )?.review_config.neighbors.touristic_apartments.find(
                            (t) =>
                              t.value ===
                              review.review?.community?.touristic_apartments
                          )?.label
                        }
                      </Label>
                      <Label tittle={t("common.relacionVecinal")}>
                        {
                          (
                            config as Config | undefined
                          )?.review_config.neighbors.neighbors_relationship.find(
                            (t) =>
                              t.value ===
                              review.review?.community?.neighbors_relationship
                          )?.label
                        }
                      </Label>
                      <Label tittle={t("common.estadoYMantenimiento")}>
                        {
                          (
                            config as Config | undefined
                          )?.review_config.neighbors.building_maintenance.find(
                            (t) =>
                              t.value ===
                              review.review?.community?.building_maintenance
                          )?.label
                        }
                      </Label>
                      <Label tittle={t("common.limpieza")}>
                        {
                          (
                            config as Config | undefined
                          )?.review_config.neighbors.building_cleaning.find(
                            (t) =>
                              t.value ===
                              review.review?.community?.building_cleaning
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
                        {review.review?.community?.comment && (
                          <div className="flex">
                            <Image src={comillas} alt="20" className="h-fit" />
                            <p className="pl-2 text-sm md:text-base">
                              {review.review?.community?.comment}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              <div className="border-b-2 lg:mb-8 mb-4 mt-4">
                <h5 className="mb-2">{t("common.zona300")}</h5>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-8 mb-10">
                <Label tittle={t("common.tipologiaAmbiente")}>
                  {vibe
                    ?.filter((vibes) => vibes.count > 1)
                    .slice(0, 3)
                    .map(
                      (vibes) =>
                        (
                          config as Config | undefined
                        )?.review_config.neighborhood.vibe.find(
                          (name) => name.value === vibes.word
                        )?.label
                    )
                    .join(", ")}
                </Label>
                <Label tittle={t("common.turistas")}>
                  {
                    (
                      config as Config | undefined
                    )?.review_config.neighborhood.tourists.find(
                      (t) => t.value === review.review?.neighbourhood?.tourists
                    )?.label
                  }
                </Label>
                <Label tittle={t("common.ruido")}>
                  {
                    (
                      config as Config | undefined
                    )?.review_config.neighborhood.noise.find(
                      (t) => t.value === review.review?.neighbourhood?.noise
                    )?.label
                  }
                </Label>
                <Label tittle={t("common.seguridad")}>
                  {
                    (
                      config as Config | undefined
                    )?.review_config.neighborhood.security.find(
                      (t) => t.value === review.review?.neighbourhood?.security
                    )?.label
                  }
                </Label>
                <Label tittle={t("common.limpieza")}>
                  {
                    (
                      config as Config | undefined
                    )?.review_config.neighborhood.cleaning.find(
                      (t) => t.value === review.review?.neighbourhood?.cleaning
                    )?.label
                  }
                </Label>
                <Label tittle={t("common.services")}>
                  {services
                    ?.filter((services) => services.count > 2)
                    .slice(0, 5)
                    .map(
                      (services) =>
                        (
                          config as Config | undefined
                        )?.review_config.neighborhood.services.find(
                          (name) => name.value === services.word
                        )?.label
                    )
                    .join(", ")}
                </Label>
                <div className="grid col-span-2">
                  {review?.review?.community?.comment && (
                    <div className="flex">
                      <Image src={comillas} alt="20" className="h-fit" />
                      <p className="pl-2 text-sm md:text-base">
                        {review.review?.community?.comment}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogReport
              isOpen={openModalInfo}
              setIsOpen={setOpenModalInfo}
              reviewId={review?.id}
            />
          </div>
          <Report
            onAction={() => {
              setOpenModalInfo(!openModalInfo);
            }}
          />
        </>
      )}
    </div>
  );
};
