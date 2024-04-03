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
import { Analysis } from "@/models/analysis";
import { getBuilding } from "@/models/building";
import { getReviewsByBuidingId } from "@/models/review";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BuildingPage({ analysis }: { analysis: Analysis }) {
  const router = useRouter();
  const t = useTranslations();
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
  // eslint-disable-next-line quotes
  const [activeSection, setActiveSection] = useState<string>(
    Object.keys(sections)[0]
  );

  const menuOptions = Object.keys(sections).map((sectionKey) => {
    return {
      key: sectionKey,
      title: sections[sectionKey].title,
      onClick: () => setActiveSection(sectionKey),
    };
  });
  const OpenStreetMap = dynamic(
    () => import("../../../components/molecules/OpenStreetMap"),
    {
      ssr: false,
    }
  );
  const notOpinions = analysis.reviews.length === 0;
  // const notEnoughStats = analysis.neighbourhood.stats[0].total < 3;

  //con esto estoy deshabilitando el server side rendering, para este componente solo. Para que funcione
  return (
    <MainLayout>
      <div className="lg:p-14 bg-white p-4 mb-11 lg:mb-0">
        <div className="flex justify-between">
          {notOpinions ? (
            <h5 className="lg:text-3xl mb-7">{analysis.address}</h5>
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
            wordCloud: [], //analysis.neighbourhood?.wordCloud,
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

              {/*@ts-ignore*/}
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
                    {t("common.write-review")}
                  </Button>
                </div>
              )}
            </div>
            <div className="w-auto hidden md:block">
              <BannerOpinion
                className="sticky top-10"
                text={t("common.quieresDejarOpinion")}
                textButton={t("common.escribeOpinion")}
              />
            </div>
            <AreaResume
              className="col-span-2"
              reviews={analysis.reviews}
              stats={[] /* analysis.neighbourhood.stats */}
              notEnoughStats={true /* notEnoughStats */}
            />
          </div>
        </AnalysisContext.Provider>
      </div>
    </MainLayout>
  );
}

export const getServerSideProps = async (contexto: any) => {
  const { params } = contexto;
  const { buildingId } = params;
  console.log(buildingId);

  // TODO: needs to return an Analysis Object (check legacy backend)
  const building = await getBuilding(buildingId);

  if (!building) {
    return {
      redirect: {
        destination: "/", // The path to redirect to
        permanent: false, // If the redirection is permanent (HTTP 301) or temporary (HTTP 307)
      },
    };
  }
  const reviews = await getReviewsByBuidingId(buildingId);
  console.log(building);
  console.log(reviews);

  const analysis = new Analysis({
    buildingId: building!.id,
    address: building?.address,
    reviews,
    latitude: building?.latitude,
    longitude: building?.longitude,
  });

  /* const translations = await serverSideTranslations(locale, [
    "common",
    "generalValuation",
    "floorValuations",
    "communityValuations",
    "areaValuations",
    "areaResume",
    "realstate",
  ]); */

  return {
    props: {
      analysis /* ?.data */,
      /* ...translations, */
    },
  };
};
