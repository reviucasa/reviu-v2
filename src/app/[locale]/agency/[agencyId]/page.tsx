"use client";
import { Label } from "@/components/atoms/Label";
import { RealStateLayout } from "@/components/layouts/realStateLayout";
import { BannerOpinion } from "@/components/molecules/BannerOpinion";
import Image from "next/image";
import green_house from "../../../../../public/green_house.png";
import comillas from "../../../../../public/comillas.png";
import { useTranslations } from "next-intl";
import { ApartmentLocation } from "@/components/atoms/ApartmentLocation";
import { reviewConfigParams } from "@/staticData";
import { Review, getReviewsByAgencyId } from "@/models/review";
import { RealStateAgency, getAgency } from "@/models/agency";
import React from "react";
import { useQuery } from "@tanstack/react-query";

export default function Agency({ params }: { params: { agencyId: string } }) {
  const t = useTranslations();
  const config = useTranslations("config");

  const { data: agency, error } = useQuery<RealStateAgency | undefined, Error>({
    queryKey: ["agency", params.agencyId],
    queryFn: () => getAgency(params.agencyId),
  });

  const { data: reviews } = useQuery<Review[] | undefined, Error>({
    queryKey: ["reviews", params.agencyId],
    queryFn: () => getReviewsByAgencyId(params.agencyId),
  });

  if (!reviews || !agency) {
    return <div>Loading...</div>;
  }

  const lengthReview = reviews.filter(
    (review) => review.data.management?.isRealStateAgency
  ).length;

  return (
    <RealStateLayout>
      <div className="lg:px-16 px-4 pt-10 pb-20 bg-white">
        <span className="text-[10px] leading-[14px] font-bold tracking-[1px] mb-2 uppercase">
          {t("agency.informacionInmobiliaria")}
        </span>
        <h3>{agency.name}</h3>
        <div className="relative grid lg:grid-cols-[1fr_auto] lg:gap-8 md:gap-4 grid-cols-1 lg:pt-16 pt-6">
          <div className="w-full">
            <div className="flex lg:flex-col flex-row mb-8 justify-between">
              <h5 className="lg:text-xl text-base">
                {t("agency.valoracionesPisos")}
              </h5>
              <p className="text-base font-normal">
                {lengthReview > 1
                  ? lengthReview + " " + t("agency.reseñas")
                  : lengthReview + " " + t("agency.reseña")}
              </p>
            </div>
            {reviews
              .filter((review) => review.data.management?.isRealStateAgency)
              .map((review) => {
                return (
                  <div
                    className={`border border-gray-300 rounded-md mb-8 lg:p-0 lg:pt-2 p-4`}
                    key={review.id}
                  >
                    <div className="lg:flex hidden items-center lg:py-4 lg:px-6 w-full lg:justify-between ">
                      <div className="bg-gray-300 rounded-full h-8 w-8  flex items-center justify-center">
                        <Image
                          quality={100}
                          src={green_house}
                          width={16}
                          height={16}
                          alt="green house"
                        />
                      </div>
                    </div>
                    <div className="flex lg:flex-row flex-col pb-6 lg:mx-6 lg:gap-6">
                      <div className="flex justify-between mb-6 lg:w-1/3">
                        <ApartmentLocation
                          className="flex flex-col lg:gap-5 gap-3 lg:w-full w-2/3"
                          review={review}
                        />
                        <div className="flex bg-gray-300 lg:hidden rounded-full h-8 w-8 items-center justify-center">
                          <Image
                            quality={100}
                            src={green_house}
                            width={16}
                            height={16}
                            alt="green house"
                          />
                        </div>
                      </div>
                      <div className="flex-1 lg:grid grid-cols-2 grid-rows lg:gap-8">
                        <Label
                          title={t("agency.comoHaSidoElTrato")}
                          className="mb-4"
                        >
                          {config(
                            `landlord.landlordTreatment.${review?.data?.management?.realStateDealing}`
                          )}
                        </Label>
                        {/* <Label
                          title={t("agency.cuandoSurgioProblema")}
                          className="mb-4"
                        >
                          {config(
                            `landlord.problemSolving.${review?.data?.management?.problemSolving}`
                          )}
                        </Label> */}
                        <Label
                          title={t("common.devolvieronFianza")}
                          className="mb-4"
                        >
                          {config(
                            `landlord.deposit.${review?.data?.management?.deposit}`
                          )}
                        </Label>
                        <div className="grid col-span-2">
                          <div className="flex  gap-4">
                            <Image src={comillas} alt="20" className="h-fit" />
                            <div>
                              <p className="font-bold text-sm md:text-base">
                                {t("agency.queConsejosDarias")}
                              </p>
                              <p className="text-sm md:text-base">
                                {review.data?.management?.adviceRealState}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="w-auto">
            <div className="w-auto hidden md:block">
              <BannerOpinion
                className="sticky top-10"
                text={t("agency.eresInmobiliariaCasero")}
                textColor="black"
                textButton={t("agency.contactaNosotros")}
                colorButton="btn-secondary-500"
                bgCard="bg-secondary-200"
              />
            </div>
          </div>
        </div>
      </div>
    </RealStateLayout>
  );
}
