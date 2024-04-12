"use client";
import { Label } from "@/components/atoms/Label";
import { BannerOpinion } from "@/components/molecules/BannerOpinion";
import Image from "next/image";
import green_house from "public/green_house.png";
import comillas from "public/comillas.png";
import lupa from "public/lupa.png";
import { useTranslations } from "next-intl";
import { ApartmentLocation } from "@/components/atoms/ApartmentLocation";
import { Review, getReviewsByAgencyId } from "@/models/review";
import { RealStateAgency, getAgency } from "@/models/agency";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import { AgencyComboBox } from "@/components/atoms/AgencyComboBox";
import { useRouter } from "next/navigation";
import { FieldError } from "@/components/atoms/FieldError";
import cardBannerImage from "public/real-state-banner.jpg";
import { MainLayout } from "@/components/layouts/MainLayout";

export default function Agency({ params }: { params: { agencyId: string } }) {
  const router = useRouter();
  const t = useTranslations();
  const config = useTranslations("config");
  const [selectedRealStateAgency, setSelectedRealStateAgency] =
    useState<RealStateAgency>();
  const [error, setError] = useState<string>();

  const { data: agency, error: agencyError } = useQuery<
    RealStateAgency | undefined,
    Error
  >({
    queryKey: ["agency", params.agencyId],
    queryFn: () => getAgency(params.agencyId),
  });

  const { data: reviews } = useQuery<Review[] | undefined, Error>({
    queryKey: ["reviews", params.agencyId],
    queryFn: () => getReviewsByAgencyId(params.agencyId),
  });

  const onSelectRealStateAgency = async (agency: RealStateAgency) => {
    setSelectedRealStateAgency(agency);
    if (agency) {
      router.push(`/agency/${agency.documentId}`);
    } else {
      setError(t("common.noSeEncontroLaInmobiliaria"));
    }
  };

  if (!reviews || !agency) {
    return (
      <MainLayout>
        {agencyError ? (
          <div className="lg:px-16 px-8 pt-20 pb-40 bg-white text-center md:text-start">
            <span className="text-[10px] leading-[14px] font-bold tracking-[1px] mb-2 uppercase">
              {t("common.searchError")}
            </span>
            <h3>{t("common.agencyNotFound")}</h3>
            <div className="flex flex-col w-full md:w-1/2 items-center md:items-start mt-12	">
              <AgencyComboBox
                icon={lupa}
                placeholder={t("common.searchAgency")}
                className="lg:w-3/4 w-full"
                selectedRealStateAgency={selectedRealStateAgency}
                setSelectedRealStateAgency={onSelectRealStateAgency}
              />
              <div className="flex lg:w-3/4 w-full">
                <FieldError className=" my-3">{error}</FieldError>
              </div>
            </div>
          </div>
        ) : (
          <div className="top-0 left-0 flex justify-center items-center w-full h-[60vh] z-50 bg-white opacity-90">
            <BounceLoader color="#d8b4fe" size={140} />
          </div>
        )}
      </MainLayout>
    );
  }

  const lengthReview = reviews.filter(
    (review) => review.data.management?.isRealStateAgency
  ).length;

  return (
    <MainLayout>
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
                        {review?.data?.management?.deposit && (
                          <Label
                            title={t("common.devolvieronFianza")}
                            className="mb-4"
                          >
                            {config(
                              `landlord.deposit.${review?.data?.management?.deposit}`
                            )}
                          </Label>
                        )}
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
                image={cardBannerImage}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
