import { DropDownShare } from "@/components/atoms/DropDownShare";
import { MainLayout } from "@/components/layouts/MainLayout";
import { BannerOpinion } from "@/components/molecules/BannerOpinion";
import { HeaderAddressComboBox } from "@/components/molecules/HeaderAddressComboBox";

import { computeReviewsSummary } from "@/helpers/computeReviewsSummary";
import { getBuilding, getBuildingByAddress } from "@/models/building";
import { getReviewsByBuidingId, Review } from "@/models/review";
import { getTranslations } from "next-intl/server";
import { BounceLoader } from "react-spinners";
import cardBannerImage from "public/images/leave-review-banner.jpg";
import BuildingView from "@/components/organism/BuildingView";
import { toPlainObject } from "lodash";
import { locales } from "../../layout";
import { mainKeywords } from "@/staticData";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale, building },
}: {
  params: { locale: string; building: string };
}) {
  // Fetch building data using the buildingId
  // const building = await getBuilding(buildingId);

  const addressComponents = decodeURIComponent(building).split("-");

  const titleDetail =
    locale == "en"
      ? `Reviu | Reviews about ` // : ${building?.address + ", " + building?.postalCode}
      : locale == "es"
      ? `Reviu | Reseñas sobre ` // : ${building?.address + ", " + building?.postalCode}
      : `Reviu | Ressenyes sobre `; // : ${building?.address + ", " + building?.postalCode}

  const title = titleDetail + addressComponents.join(", ");

  const description =
    locale == "en"
      ? `Learn more about ${addressComponents.join(
          ", "
        )}. Read reviews and see detailed information about this rental property on Reviu.`
      : locale == "es"
      ? `Conoce más sobre ${addressComponents.join(
          ", "
        )}. Lee reseñas y consulta información detallada sobre esta propiedad de alquiler en Reviu.`
      : `Coneix més sobre ${addressComponents.join(
          ", "
        )}. Llegeix ressenyes i consulta informació detallada sobre aquesta propietat de lloguer a Reviu.`;

  const keywords = [
    addressComponents.join(" "),
    ...mainKeywords(locale).slice(0, 3),
  ];

  return {
    title,
    description,
    keywords,
  };
}

function convertTimestampToPlainObject(review: Review) {
  return {
    ...review,
    timeCreated: review.timeCreated.toMillis(), // or toDate() if you prefer ISO string
    timeUpdated: review.timeUpdated.toMillis(), // or toDate() if you prefer ISO string
  };
}

export default async function BuildingPage({
  params,
}: {
  params: { building: string };
}) {
  const t = await getTranslations();

  const [street, number, city] = decodeURIComponent(params.building).split("-");

  const building = await getBuildingByAddress(street, number);

  // const reviews = await getReviewsByBuidingId(params.buildingId);
  let reviews: Review[] = [];

  if (building?.id) {
    reviews = await getReviewsByBuidingId(building.id);
  }

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
      address: [building.address, building.number, city].join(", "),
      reviews: reviews.map((review) => convertTimestampToPlainObject(review)),
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
          <div className="flex flex-col gap-2 mb-7">
            <h1 className="text-2xl lg:text-3xl  font-secondary">
              {analysis.address.replace(", Espanya", "")}
            </h1>
            <p className="text-sm tracking-widest">
              0{building?.postalCode} /{" "}
              {building?.neighbourhood.toLocaleUpperCase()}
            </p>
          </div>
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
        </div>
      </div>
    </MainLayout>
  );
}
