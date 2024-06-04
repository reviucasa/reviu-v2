import { DropDownShare } from "@/components/atoms/DropDownShare";
import { MainLayout } from "@/components/layouts/MainLayout";
import { BannerOpinion } from "@/components/molecules/BannerOpinion";
import { HeaderAddressComboBox } from "@/components/molecules/HeaderAddressComboBox";

import { computeReviewsSummary } from "@/helpers/computeReviewsSummary";
import { getBuilding } from "@/models/building";
import { getReviewsByBuidingId } from "@/models/review";
import { getTranslations } from "next-intl/server";
import { BounceLoader } from "react-spinners";
import cardBannerImage from "public/images/leave-review-banner.jpg";
import BuildingView from "@/components/organism/BuildingView";
import { toPlainObject } from "lodash";
import { locales } from "../../layout";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale, buildingId },
}: {
  params: { locale: string; buildingId: string };
}) {
  // Fetch building data using the buildingId
  // const building = await getBuilding(buildingId);
  const building = {
    address: 'Address',
    postalCode: '08004'
  }

  const titleDetail =
    locale == "en"
      ? `Building Details: ${building?.address + ", " + building?.postalCode}`
      : locale == "es"
      ? `Detalles del Edificio: ${
          building?.address + ", " + building?.postalCode
        }`
      : `Detalls de l'Edifici: ${
          building?.address + ", " + building?.postalCode
        }`;

  const description =
    locale == "en"
      ? `Learn more about ${
          building?.address + ", " + building?.postalCode
        }. Read reviews and see detailed information about this rental property on Reviu.`
      : locale == "es"
      ? `Conoce más sobre ${
          building?.address + ", " + building?.postalCode
        }. Lee reseñas y consulta información detallada sobre esta propiedad de alquiler en Reviu.`
      : `Coneix més sobre ${
          building?.address + ", " + building?.postalCode
        }. Llegeix ressenyes i consulta informació detallada sobre aquesta propietat de lloguer a Reviu.`;

  return {
    title: titleDetail,
    description,
  };
}

export default async function BuildingPage({
  params,
}: {
  params: { buildingId: string };
}) {
  const t = await getTranslations();
  const building = await getBuilding(params.buildingId);
  const reviews = await getReviewsByBuidingId(params.buildingId);

  // Redirect if there's an error fetching the building
  if (!building) {
    console.error("Building not found");
    /* router.push("/"); */
  }

  // Construct the Analysis object once we have all the required data
  let analysis;

  if (building && reviews) {
    const neighbourhood = computeReviewsSummary(reviews);

    analysis = {
      buildingId: building.id,
      address: [building.address, building.number, "Barcelona"].join(", "),
      reviews: reviews.map((r) => toPlainObject(r)),
      latitude: building.latitude,
      longitude: building.longitude,
      neighbourhood,
    };
  }

  if (!analysis) {
    return !building ? (
      <div className="lg:px-16 px-8 pt-20 pb-40 bg-white text-center md:text-start">
        <span className="text-[10px] leading-[14px] font-bold tracking-[1px] mb-2 uppercase">
          {t("common.searchError")}
        </span>
        <h3>{t("common.buildingNotFound")}</h3>
        <HeaderAddressComboBox />
      </div>
    ) : (
      <div className="top-0 left-0 flex justify-center items-center w-full h-[60vh] z-50 bg-white opacity-90">
        <BounceLoader color="#d8b4fe" size={140} />
      </div>
    );
  }

  const notOpinions = analysis.reviews.length === 0;

  return (
    <MainLayout>
      {/* <BuildingView buildingId={params.buildingId} /> */}
      <div className="lg:p-14 bg-white p-4 mb-11 lg:mb-0">
        <div className="flex justify-between">
          {notOpinions ? (
            <div className="flex flex-col gap-2 mb-7">
              <h5 className="lg:text-3xl  font-secondary">
                {analysis.address.split(",").slice(0, 2)}
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

        <div className="relative grid lg:grid-cols-[1fr_auto] lg:gap-8 md:gap-4 grid-cols-1">
          <BuildingView analysis={analysis}>
            <div className="w-auto hidden md:block">
              <BannerOpinion
                className="sticky top-10"
                text={t("common.quieresDejarOpinion")}
                textButton={t("common.escribeOpinion")}
                image={cardBannerImage}
              />
            </div>
          </BuildingView>
          {/* <AnalysisContext.Provider
            value={{
              sections: sections,
              analysisSectionActive: activeSection,
              setAnalysisSectionActive: setActiveSection,
              wordCloud: analysis.neighbourhood.wordCloud,
            }}
          >
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
                  <Link
                    className="btn btn-primary-500 content-center overflow-hidden px-14"
                    href="/review"
                  >
                    {t("common.writeReview")}
                  </Link>
                </div>
              )}
            </div>
            <AreaResume
              className="col-span-2"
              reviews={analysis.reviews}
              stats={analysis.neighbourhood.stats}
              notEnoughStats={notEnoughStats}
            />
          </AnalysisContext.Provider> */}
        </div>
      </div>
    </MainLayout>
  );
}
