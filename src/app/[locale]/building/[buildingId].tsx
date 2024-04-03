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
import { AnalisisContext } from "@/context/AnalisisSectionActive";
import { getReviewsByBuidingId } from "@/models/review";
import { Analisis } from "@/models/types";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BuildingPage({ analisis }: { analisis: Analisis }) {
  const router = useRouter();
  const t = useTranslations();
  const sections: {
    [key: string]: { title: string; sectionObject: JSX.Element };
  } = {
    valuationGeneral: {
      title: t("common.valuationGeneral"),
      sectionObject: <GeneralValuation reviews={analisis.building.reviews} />,
    },
    valuationFloor: {
      title: t("common.valuationFloor"),
      sectionObject: <FloorValuation reviews={analisis.building.reviews} />,
    },
    valuationCommunity: {
      title: t("common.valuationCommunity"),
      sectionObject: <CommunityValuation reviews={analisis.building.reviews} />,
    },
    valuationArea: {
      title: t("common.valuationArea"),
      sectionObject: <AreaValuation reviews={analisis.building.reviews} />,
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
  const notOpinions = analisis.building.reviews.length === 0;
  const notEnoughStats = analisis.building.neighbourhood.stats[0].total < 3;

  //con esto estoy deshabilitando el server side rendering, para este componente solo. Para que funcione
  return (
    <MainLayout>
      <div className="lg:p-14 bg-white p-4 mb-11 lg:mb-0">
        <div className="flex justify-between">
          {notOpinions ? (
            <h5 className="lg:text-3xl mb-7">{analisis.building.address}</h5>
          ) : (
            <h5 className="lg:text-3xl mb-7">
              {analisis.building.reviews[0]?.address}
            </h5>
          )}
          <DropDownShare />
        </div>
        <AnalisisContext.Provider
          value={{
            sections: sections,
            analisisSectionActive: activeSection,
            setAnalisisSectionActive: setActiveSection,
            wordCloud: analisis.building.neighbourhood.wordCloud,
          }}
        >
          <div className="relative grid lg:grid-cols-[1fr_auto] lg:gap-8 md:gap-4 grid-cols-1">
            <div>
              <div className="h-32 sm:h-72 w-full">
                <OpenStreetMap
                  latitude={analisis.building.latitude}
                  longitude={analisis.building.longitude}
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
              reviews={analisis.building.reviews}
              stats={analisis.building.neighbourhood.stats}
              notEnoughStats={notEnoughStats}
            />
          </div>
        </AnalisisContext.Provider>
      </div>
    </MainLayout>
  );
}

export const getServerSideProps = async (contexto: any) => {
  const { locale, params } = contexto;
  const { buildingId } = params;
  console.log(buildingId);

  // TODO: needs to return an Analisis Object (check legacy backend) 
  const response = await getReviewsByBuidingId(buildingId);

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
      analisis: response /* ?.data */,
      /* ...translations, */
    },
  };
};
