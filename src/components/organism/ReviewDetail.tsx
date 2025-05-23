"use client";
import Image from "next/image";
import happy from "public/images/happy.png";
import sad from "public/images/sad.png";
import { useContext, useState } from "react";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import comillas from "public/images/comillas.png";
import GreenHouse from "public/images/green_house.png";
import { ApartmentLocation } from "../atoms/ApartmentLocation";
import { Chip } from "../atoms/Chip";
import { Label } from "../atoms/Label";
import { Report } from "../atoms/Report";
import { DialogReport } from "../molecules/DialogReport";
import { useTranslations } from "next-intl";
import { Review, ReviewStatus, unsuspendReview } from "@/models/review";
import { DialogImage } from "../molecules/DialogImage";
import { DialogDelete } from "../molecules/DialogDelete";
import { Suspend } from "../atoms/Suspend";
import { ReviewStatusBadge } from "../atoms/ReviewStatusBadges";
import { useAuth } from "@/context/auth";
import { UserStatus } from "@/models/user";
import { Unsuspend } from "../atoms/Unsuspend";
import { BuildingAnalysisContext } from "@/context/BuildingAnalysis";

import dynamic from "next/dynamic";
import { getAgency } from "@/models/agency";

const OpenStreetMap = dynamic(() => import("../molecules/OpenStreetMap"), {
  ssr: false,
});

export const ReviewDetail = ({
  review,
  showMap = true,
}: {
  review: Review;
  showMap?: boolean;
}) => {
  const { user, claims } = useAuth();
  const t = useTranslations();
  const { wordCloud } = useContext(BuildingAnalysisContext);
  const vibe = wordCloud?.find((name) => name.group === "vibe")?.words;
  const services = wordCloud?.find((name) => name.group === "services")?.words;
  const [openModalInfo, setOpenModalInfo] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [openModalImage, setOpenModalImage] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const config = useTranslations("config");

  return (
    <div className="pb-20 md:pb-0">
      {review && (
        <>
          <div className="bg-white grid lg:grid-cols-[auto_1fr] grid-col border-b-2 mb-10 md:gap-10 gap-5">
            <div className="lg:hidden flex-1  top-0 h-14  bg-white justify-start flex items-center	">
              <h6 className="font-bold">{t("common.detalleOpinion")}</h6>
            </div>
            <div className="lg:border-none border border-gray-300 rounded-md ">
              <Chip
                className={`flex lg:hidden text-xs rounded-none items-center gap-3 h-10 ${
                  review?.data?.opinion?.recomend
                    ? "bg-lime text-primary-500"
                    : "bg-red-500 text-white"
                }`}
              >
                {review?.data?.opinion?.recomend ? (
                  <FaRegThumbsUp size={17} />
                ) : (
                  <FaRegThumbsDown size={17} />
                )}
                {review?.data?.opinion?.recomend
                  ? t("common.loRecomiendo")
                  : t("common.noLoRecomiendo")}
              </Chip>
              <div className="lg:mt-3 mt-0 lg:p-0 p-4 overflow-hidden sticky top-10">
                <div className="lg:flex lg:flex-col lg:justify-end lg:pb-4 lg:sticky top-5 grid grid-cols-[1fr_auto]">
                  <div className="bg-gray-200 rounded-full h-8 w-8  items-center justify-center hidden lg:flex lg:order-first ">
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
                  {user && claims?.admin && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <ReviewStatusBadge status={review.status} />
                    </div>
                  )}
                  {review.location && showMap && (
                    <div className="hidden lg:block h-64 w-full mt-8">
                      <OpenStreetMap
                        latitude={review.location.coordinates.latitude}
                        longitude={review.location.coordinates.longitude}
                        zoom={15}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-end pb-4 relative top-5">
                <Chip
                  className={`text-xs lg:flex hidden items-center gap-3 h-10 px-4 ${
                    review?.data?.opinion?.recomend
                      ? "bg-lime text-primary-500"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {review?.data?.opinion?.recomend ? (
                    <FaRegThumbsUp size={17} />
                  ) : (
                    <FaRegThumbsDown size={17} />
                  )}
                  {review?.data?.opinion?.recomend
                    ? t("common.loRecomiendo")
                    : t("common.noLoRecomiendo")}
                </Chip>
              </div>
              <div className="border-b-2 lg:mb-8 mb-4 mt-4">
                <h6 className="mb-2 lg:text-xl font-bold">
                  {t("common.opinion")}
                </h6>
              </div>
              <div className="flex-1 mb-10">
                <span className="font-bold text-sm md:text-base">
                  {review?.data?.opinion?.title}
                </span>
                <div className="flex flex-col lg:gap-6 gap-4 lg:mt-8 mt-4 mb-6">
                  <span className="flex align-top gap-4">
                    <div className="w-8 h-8">
                      <Image
                        quality={100}
                        src={comillas}
                        width={24}
                        height={24}
                        alt={t("common.comentarioPositivo")}
                      />
                    </div>
                    <span className="flex-1 text-sm md:text-base">
                      {review?.data?.opinion?.title}
                    </span>
                  </span>
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
                      {review?.data?.opinion?.positive}
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
                      {review?.data?.opinion?.negative}
                    </div>
                  </span>
                </div>
              </div>
              {review.data.opinion?.images &&
                review.data.opinion?.images?.length > 0 && (
                  <div className="border-b-2 lg:mb-8 mb-4 mt-4">
                    <h6 className="mb-2 lg:text-xl font-bold">
                      {t("common.Imágenes")}
                    </h6>
                  </div>
                )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {review.data.opinion?.images &&
                  review.data.opinion?.images.map((image, idx) => (
                    <div
                      key={idx}
                      className="text-center cursor-pointer"
                      onClick={async () => {
                        setSelectedImage(idx);
                        setOpenModalImage(!openModalImage);
                      }}
                    >
                      <div className="flex flex-col relative text-center gap-y-2">
                        <Image
                          id={`image-preview-${idx}`}
                          src={image.url}
                          width={176}
                          height={288}
                          className="rounded-md object-cover border border-gray-200 w-44 h-72"
                          alt="selected image"
                          unoptimized
                        />
                        <p> {image.caption}</p>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="border-b-2 lg:mb-8 mb-4 mt-4">
                <h6 className="mb-2 lg:text-xl font-bold">
                  {t("common.valoracion")}
                </h6>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-8 mb-10">
                <Label title={t("common.temperaturaVerano")}>
                  {config(
                    `buildingQuality.summerTemperature.${review?.data?.valuation?.summerTemperature}`
                  )}
                </Label>
                <Label title={t("common.temperaturaInvierno")}>
                  {config(
                    `buildingQuality.winterTemperature.${review?.data?.valuation?.winterTemperature}`
                  )}
                </Label>
                <Label title={t("common.ruido")}>
                  {config(
                    `buildingQuality.noise.${review.data?.valuation?.noise}`
                  )}
                </Label>
                <Label title={t("common.luz")}>
                  {config(
                    `buildingQuality.light.${review.data?.valuation?.light}`
                  )}
                </Label>

                <Label title={t("common.estadoYMantenimiento")}>
                  {config(
                    `buildingQuality.maintenance.${review?.data?.valuation?.maintenance}`
                  )}
                </Label>
                <Label title={t("common.services")}>
                  {review?.data?.community?.services
                    ?.map((type: string) =>
                      config(`neighbors.services.${type}`)
                    )
                    .join(", ")}
                </Label>
              </div>
              {review?.data?.management && (
                <div className="border-b-2 lg:mb-8 mb-4 mt-4">
                  <h6 className="mb-2 lg:text-xl font-bold">
                    {t("common.gestion")}
                  </h6>
                </div>
              )}
              <div className="flex-1 grid grid-cols-2 gap-8">
                {review?.data?.management?.isRealStateAgency && (
                  <>
                    <div className="flex flex-col gap-2 text-sm md:text-base">
                      <label>{t("common.inmobiliaria")}</label>
                      {review.data.management.agencyId ? (
                        <div
                          className="text-sm md:text-base cursor-pointer text-secondary-500 font-semibold hover:no-underline"
                          /* href={`/agency/${encodeURIComponent(
                            review.data.management?.realStateAgency
                              .toLocaleLowerCase()
                              .replaceAll(" ", "-")
                          )}`}
                          title={tLinks("/agency")} */
                          onClick={async () => {
                            const agency = await getAgency(
                              review.data.management!.agencyId!
                            );

                            if (agency?.lowercase) {
                              window.location.href = `/agency/${agency?.lowercase}`;
                            }
                          }}
                        >
                          {review.data?.management?.realStateAgency}
                        </div>
                      ) : (
                        <span>{t("managementReview.noSeInmobiliaria")}</span>
                      )}
                    </div>
                    <Label title={t("agency.comoHaSidoElTrato")}>
                      {config(
                        `landlord.landlordTreatment.${review?.data?.management?.realStateDealing}`
                      )}
                    </Label>
                  </>
                )}
                {review?.data?.management?.landlordDealing && (
                  <Label title={t("common.tratoCasero")}>
                    {config(
                      `landlord.landlordTreatment.${review?.data?.management?.landlordDealing}`
                    )}
                  </Label>
                )}

                {review?.data?.management?.problemSolving && (
                  <Label title={t("common.respuestaProblema")}>
                    {config(
                      `landlord.problemSolving.${review?.data?.management?.problemSolving}`
                    )}
                  </Label>
                )}
                {review?.data?.management?.deposit && (
                  <Label title={t("common.devolvieronFianza")}>
                    {config(
                      `landlord.deposit.${review?.data?.management?.deposit}`
                    )}
                  </Label>
                )}
              </div>

              <div className="flex flex-col gap-6 my-8">
                {review?.data?.management?.isRealStateAgency && (
                  <div className="flex flex-col">
                    <div className="flex gap-4">
                      <Image
                        src={comillas}
                        width={16}
                        height={16}
                        alt='"'
                        className="h-fit"
                      />
                      <div>
                        <p className="font-bold text-sm md:text-base">
                          {t("common.consejosInmobiliaria")}
                        </p>
                        <p className="text-sm md:text-base">
                          {review.data?.management?.adviceRealState}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {review?.data?.management?.adviceLandlord && (
                  <div className="flex flex-col">
                    <div className="flex gap-4">
                      <Image
                        src={comillas}
                        width={16}
                        height={16}
                        alt='"'
                        className="h-fit"
                      />
                      <div>
                        <p className="font-bold text-sm md:text-base">
                          {t("common.consejosCasero")}
                        </p>
                        <p className="text-sm md:text-base">
                          {review?.data?.management?.adviceLandlord}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {review &&
                review.data &&
                review.data.community &&
                Object.keys(review.data.community).length > 0 && (
                  <>
                    <div className="border-b-2 mb-8 mt-10">
                      <h6 className="mb-2 lg:text-xl font-bold">
                        {t("common.comunidadVecinos")}
                      </h6>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-8">
                      {review.data.community.buildingNeighborhood && (
                        <Label title={t("common.tipologiaResidentes")}>
                          {review.data?.community?.buildingNeighborhood
                            ?.map((type: string) =>
                              config(`neighbors.buildingNeighborhood.${type}`)
                            )
                            .join(", ")}
                        </Label>
                      )}

                      {review?.data?.community?.touristicApartments && (
                        <Label title={t("common.pisosTuristicos")}>
                          {config(
                            `neighbors.touristicApartments.${review?.data?.community?.touristicApartments}`
                          )}
                        </Label>
                      )}
                      {review?.data?.community?.neighborsRelationship && (
                        <Label title={t("common.relacionVecinal")}>
                          {config(
                            `neighbors.neighborsRelationship.${review?.data?.community?.neighborsRelationship}`
                          )}
                        </Label>
                      )}
                      {review?.data?.community?.buildingMaintenance && (
                        <Label title={t("common.estadoYMantenimiento")}>
                          {config(
                            `neighbors.buildingMaintenance.${review?.data?.community?.buildingMaintenance}`
                          )}
                        </Label>
                      )}
                      {review?.data?.community?.buildingCleaning && (
                        <Label title={t("common.limpieza")}>
                          {config(
                            `neighbors.buildingCleaning.${review?.data?.community?.buildingCleaning}`
                          )}
                        </Label>
                      )}
                      {review.data?.community?.services && (
                        <Label title={t("common.services")}>
                          {review.data?.community?.services
                            ?.map((type: string) =>
                              config(`neighbors.services.${type}`)
                            )
                            .join(", ")}
                        </Label>
                      )}
                      <div className="grid col-span-2">
                        {review.data.community.comment && (
                          <div className="flex">
                            <Image
                              src={comillas}
                              width={16}
                              height={16}
                              alt='"'
                              className="h-fit"
                            />
                            <p className="pl-2 text-sm md:text-base">
                              {review.data?.community?.comment}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              {review && review.data && review.data.neighbourhood && (
                <>
                  <div className="border-b-2 lg:mb-8 mb-4 mt-4">
                    <h5 className="mb-2">{t("common.zona300")}</h5>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-8 mb-10">
                    <Label title={t("common.tipologiaAmbiente")}>
                      {vibe
                        ?.filter((vibes) => vibes.count > 1)
                        .slice(0, 3)
                        .map((vibes) =>
                          config(`neighbourhood.vibe.${vibes.word}`)
                        )
                        .join(", ")}
                    </Label>
                    <Label title={t("common.turistas")}>
                      {config(
                        `neighbourhood.tourists.${review?.data?.neighbourhood?.tourists}`
                      )}
                    </Label>
                    <Label title={t("common.ruido")}>
                      {config(
                        `neighbourhood.noise.${review?.data?.neighbourhood?.noise}`
                      )}
                    </Label>
                    <Label title={t("common.seguridad")}>
                      {config(
                        `neighbourhood.security.${review?.data?.neighbourhood?.security}`
                      )}
                    </Label>
                    <Label title={t("common.limpieza")}>
                      {config(
                        `neighbourhood.cleaning.${review?.data?.neighbourhood?.cleaning}`
                      )}
                    </Label>
                    <Label title={t("common.services")}>
                      {services
                        ?.filter((services) => services.count > 2)
                        .slice(0, 5)
                        .map((services) =>
                          config(
                            `neighbourhood.buildingMaintenance.${services.word}`
                          )
                        )
                        .join(", ")}
                    </Label>
                    <div className="grid col-span-2">
                      {review?.data?.neighbourhood?.comments && (
                        <div className="flex">
                          <Image
                            src={comillas}
                            width={16}
                            height={16}
                            alt='"'
                            className="h-fit"
                          />
                          <p className="pl-2 text-sm md:text-base">
                            {review.data?.neighbourhood?.comments}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <DialogImage
              isOpen={openModalImage}
              setIsOpen={setOpenModalImage}
              images={review.data.opinion?.images}
              index={selectedImage}
            />
            <DialogReport
              isOpen={openModalInfo}
              setIsOpen={setOpenModalInfo}
              reviewData={{
                id: review.id,
                userId: review.userId,
                address: review.address,
              }}
            />
            <DialogDelete
              isOpen={openModalDelete}
              setIsOpen={setOpenModalDelete}
              reviewId={review?.id}
            />
          </div>
          <div className="flex flex-row justify-between">
            {user && claims.status != UserStatus.Suspended && (
              <Report
                onAction={() => {
                  setOpenModalInfo(!openModalInfo);
                }}
              />
            )}
            {user && claims?.admin && (
              <div className="flex space-x-6">
                {review.status == ReviewStatus.Suspended && (
                  <Unsuspend
                    onAction={async () => {
                      await unsuspendReview(review.id);
                      location.reload();
                    }}
                  />
                )}

                <Suspend
                  onAction={() => {
                    setOpenModalDelete(!openModalDelete);
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
