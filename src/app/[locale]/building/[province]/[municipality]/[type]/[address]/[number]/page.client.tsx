"use client";
import { DropDownShare } from "@/components/atoms/DropDownShare";
import { BannerOpinion } from "@/components/molecules/BannerOpinion";
import { HeaderAddressComboBox } from "@/components/molecules/HeaderAddressComboBox";
import BuildingView from "@/components/organism/BuildingView";
import dynamic from "next/dynamic";
import { BounceLoader } from "react-spinners";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import cardBannerImage from "public/images/leave-review-banner.jpg";
import { decodeReadableURI, toTitleCase } from "@/helpers/stringHelpers";
import { Analysis } from "@/models/analysis";
import { Building, Coordinates, Location } from "@/models/building";
import { loader } from "@/helpers/getMunicipalityCoordinates";
import { getReviewsByPlaceId, Review } from "@/models/review";
import { computeReviewsSummary } from "@/helpers/computeReviewsSummary";
import { toPlainObject } from "lodash";

// Dynamically import the MainLayout component
const MainLayout = dynamic(() => import("@/components/layouts/MainLayout"), {
  ssr: false,
});

export default function BuildingPageClient({
  params: { locale, province, municipality, type, address, number },
}: {
  params: {
    locale: string;
    province: string;
    municipality: string;
    type: string;
    address: string;
    number: string;
  };
}) {
  const [loading, setLoading] = useState(true);
  const [placeId, setPlaceId] = useState<string>();
  const [building, setBuilding] = useState<Building | undefined>(undefined);
  const [analysis, setAnalysis] = useState<Analysis | undefined>(undefined);

  const t = useTranslations();

  const addr = toTitleCase(
    decodeReadableURI([address, number, municipality].join(", "))
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        loader.importLibrary("places").then(async () => {
          const { Place } = (await google.maps.importLibrary(
            "places"
          )) as google.maps.PlacesLibrary;

          const res = await Place.searchByText({
            textQuery: [type, address, number, municipality, province].join(
              " "
            ),
            fields: ["id"],
          });

          const placeId = res.places[0].id;

          setPlaceId(placeId);

          // Use place ID to create a new Place instance.
          const place = new Place({
            id: placeId,
            requestedLanguage: "ca",
          });

          // Call fetchFields, passing the desired data fields.
          await place.fetchFields({
            fields: ["location", "addressComponents"],
          });

          let district = "";
          let postalCode = place.addressComponents![6].longText ?? "";

          if (
            ["Barcelona", "Madrid", "Valencia"].includes(
              place.addressComponents![3].longText!
            )
          ) {
            district = place.addressComponents![2].longText ?? "";
            postalCode = place.addressComponents![7].longText ?? "";
          }

          const location: Location = {
            coordinates: {
              latitude: place.location?.lat(),
              longitude: place.location?.lng(),
            } as Coordinates,
            municipality,
            number: parseInt(place.addressComponents![0].longText ?? "0"),
            district,
            province,
            street: place.addressComponents![1].longText ?? "",
            type: "",
          };

          const building: Building = {
            address: place.formattedAddress!,
            location,
            postalCode,
          };


          setBuilding(building);


          const coordinates = {
            latitude: place.location?.lat(),
            longitude: place.location?.lng(),
          } as Coordinates;

          const reviews: Review[] = await getReviewsByPlaceId(placeId);

          if (placeId && addr) {
            const neighbourhood = computeReviewsSummary(reviews);

            const analysisData = new Analysis({
              buildingId: placeId,
              address: reviews.length > 0 ? reviews[0].address : addr,
              reviews: reviews.map((r) => toPlainObject(r)),
              latitude: coordinates!.latitude,
              longitude: coordinates!.longitude,
              neighbourhood,
            });
            setAnalysis(analysisData);
          }
        });
      } catch (error) {
        console.log("error fetching places data", error);
      }

      setLoading(false);
    };

    fetchData();
  }, [addr, locale, municipality, number, province, address, type]);

  if (loading) {
    return (
      <MainLayout>
        <div className="top-0 left-0 flex justify-center items-center w-full h-[60vh] z-50 bg-white opacity-90">
          <BounceLoader color="#d8b4fe" size={140} />
        </div>
      </MainLayout>
    );
  }

  if (!analysis) {
    return !loading ? (
      <MainLayout>
        <div className="lg:px-16 px-8 pt-20 pb-40 bg-white text-center md:text-start">
          <span className="text-[10px] leading-[14px] font-bold tracking-[1px] mb-2 uppercase">
            {t("common.searchError")}
          </span>
          <h3>{t("common.buildingNotFound")}</h3>
          <HeaderAddressComboBox className="flex-1 w-full md:w-1/2 mt-12" />
        </div>
      </MainLayout>
    ) : (
      <MainLayout>
        <div className="top-0 left-0 flex justify-center items-center w-full h-[60vh] z-50 bg-white opacity-90">
          <BounceLoader color="#d8b4fe" size={140} />
        </div>
      </MainLayout>
    );
  }

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
              {building?.postalCode} /{" "}
              {building?.location.district?.toLocaleUpperCase() ?? ""}
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
