"use client";
import { AddressComboBox } from "@/components/atoms/AddressComboBox";
import { Button } from "@/components/atoms/Button";
import { DropDownShare } from "@/components/atoms/DropDownShare";
import { TabMenu } from "@/components/atoms/TabMenu";
import { MainLayout } from "@/components/layouts/MainLayout";
import { BannerOpinion } from "@/components/molecules/BannerOpinion";
import { AreaResume } from "@/components/organism/AreaResume";
import { AreaValuation } from "@/components/organism/AreaValuation";
import { CommunityValuation } from "@/components/organism/CommunityValuation";
import { FloorValuation } from "@/components/organism/FloorValuation";
import { GeneralValuation } from "@/components/organism/GeneralValuation";
import { AnalysisContext } from "@/context/AnalysisSectionActive";
import { computeReviewsSummary } from "@/helpers/computeReviewsSummary";
import { Analysis } from "@/models/analysis";
import {
  Building,
  findBuildingByAddress,
  getBuilding,
} from "@/models/building";
import { getReviewsByBuidingId } from "@/models/review";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import { BounceLoader } from "react-spinners";
import lupa from "public/lupa.png";
import cardBannerImage from "public/leave-review-banner.jpg";
import { FieldError } from "@/components/atoms/FieldError";

export default function BuildingPage({
  params,
}: {
  params: { buildingId: string };
}) {
  const router = useRouter();
  const t = useTranslations();
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [error, setError] = useState<string>();

  const {
    data: building,
    isError: isBuildingError,
    error: buildingError,
  } = useQuery<Building | undefined, Error>({
    queryKey: ["building", params.buildingId],
    queryFn: () => getBuilding(params.buildingId),
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", params.buildingId],
    queryFn: () => getReviewsByBuidingId(params.buildingId),
  });

  // Redirect if there's an error fetching the building
  if (isBuildingError) {
    console.error(buildingError);
    /* router.push("/"); */
  }

  // Construct the Analysis object once we have all the required data
  const analysis = React.useMemo(() => {
    if (building && reviews) {
      const neighbourhood = computeReviewsSummary(reviews);

      return new Analysis({
        buildingId: building.id,
        address: [building.address, building.number, "Barcelona"].join(", "),
        reviews,
        latitude: building.latitude,
        longitude: building.longitude,
        neighbourhood,
      });
    }
  }, [building, reviews]);

  const [activeSection, setActiveSection] =
    useState<string>("valuationGeneral");

  const onSelectAddress = async (address: string) => {
    setError(undefined);
    setSelectedAddress(address);
    if (address && address != "") {
      const building = await findBuildingByAddress(address);
      if (building) {
        router.push(`/building/${building.id}`);
      } else {
        setError(t("common.noSeEncontroDirección"));
      }
    }
  };

  if (!analysis) {
    return (
      <MainLayout>
        {buildingError ? (
          <div className="lg:px-16 px-8 pt-20 pb-40 bg-white text-center md:text-start">
            <span className="text-[10px] leading-[14px] font-bold tracking-[1px] mb-2 uppercase">
              {t("common.searchError")}
            </span>
            <h3>{t("common.buildingNotFound")}</h3>
            <div className="flex flex-col w-full md:w-3/5 items-center md:items-start mt-12	">
              <AddressComboBox
                icon={lupa}
                placeholder={t("common.buscar")}
                className="lg:w-3/4 w-full"
                selectedAddress={selectedAddress}
                setSelectedAddress={onSelectAddress}
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

  const sections: {
    [key: string]: { title: string; sectionObject: JSX.Element };
  } = {
    valuationGeneral: {
      title: t("common.valuationGeneral"),
      sectionObject: <GeneralValuation reviews={analysis.reviews} />,
    },
    valuationFloor: {
      title: t("common.valuationFloor"),
      sectionObject: <FloorValuation reviews={analysis.reviews} />,
    },
    valuationCommunity: {
      title: t("common.valuationCommunity"),
      sectionObject: <CommunityValuation reviews={analysis.reviews} />,
    },
    valuationArea: {
      title: t("common.valuationArea"),
      sectionObject: <AreaValuation reviews={analysis.reviews} />,
    },
  };

  const menuOptions = Object.keys(sections).map((sectionKey) => {
    return {
      key: sectionKey,
      title: sections[sectionKey].title,
      onClick: () => setActiveSection(sectionKey),
    };
  });

  const OpenStreetMap = dynamic(
    () => import("../../../../components/molecules/OpenStreetMap"),
    {
      ssr: false,
    }
  );
  const notOpinions = analysis.reviews.length === 0;
  const notEnoughStats =
    analysis.neighbourhood.stats.length == 0
      ? true
      : analysis.neighbourhood.stats[0].total < 1;

  return (
    <MainLayout>
      <div className="lg:p-14 bg-white p-4 mb-11 lg:mb-0">
        <div className="flex justify-between">
          {notOpinions ? (
            <div className="flex flex-col gap-2 mb-7">
              <h5 className="lg:text-3xl  font-secondary">
                {analysis.address.split(",").slice(0, 2).join(" ")}
              </h5>
              <p className="text-sm tracking-widest">
                0{building?.postalCode} /{" "}
                {building?.neighbourhood.toLocaleUpperCase()}
              </p>
            </div>
          ) : (
            <h5 className="lg:text-3xl mb-7">{analysis.reviews[0]?.address}</h5>
          )}
          <DropDownShare />
        </div>
        <AnalysisContext.Provider
          value={{
            sections: sections,
            analysisSectionActive: activeSection,
            setAnalysisSectionActive: setActiveSection,
            wordCloud: analysis.neighbourhood.wordCloud,
          }}
        >
          <div className="relative grid lg:grid-cols-[1fr_auto] lg:gap-8 md:gap-4 grid-cols-1">
            <div>
              <div className="h-32 sm:h-72 w-full">
                <OpenStreetMap
                  latitude={analysis.latitude}
                  longitude={analysis.longitude}
                />
              </div>
              {!notOpinions && (
                <TabMenu
                  className="mt-8 mb-14"
                  options={menuOptions}
                  activeOption={activeSection}
                />
              )}

              {!notOpinions && (
                <div>{sections[activeSection].sectionObject}</div>
              )}
              {notOpinions && (
                <div className="flex flex-col items-center border border-gray-300 rounded-md py-12 px-8 mt-10 ">
                  <h4>{t("common.noHayOpiniones")}</h4>
                  <p className="mt-1 mb-8">{t("common.hasVividoAqui")} </p>
                  <Button
                    buttonClassName="btn-primary-500 content-center overflow-hidden px-14"
                    onClick={() => router.push("/review")}
                  >
                    {t("common.writeReview")}
                  </Button>
                </div>
              )}
            </div>
            <div className="w-auto hidden md:block">
              <BannerOpinion
                className="sticky top-10"
                text={t("common.quieresDejarOpinion")}
                textButton={t("common.escribeOpinion")}
                image={cardBannerImage}
              />
            </div>
            <AreaResume
              className="col-span-2"
              reviews={analysis.reviews}
              stats={analysis.neighbourhood.stats}
              notEnoughStats={notEnoughStats}
            />
          </div>
        </AnalysisContext.Provider>
      </div>
    </MainLayout>
  );
}
