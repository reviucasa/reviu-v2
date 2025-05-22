"use client";
import { DropDownShare } from "@/components/atoms/DropDownShare";
import { BannerOpinion } from "@/components/molecules/BannerOpinion";
import { HeaderAddressComboBox } from "@/components/molecules/HeaderAddressComboBox";
import BuildingView from "@/components/organism/BuildingView";
import { computeReviewsSummary } from "@/helpers/computeReviewsSummary";
import { getReviewsByCatastroRef, Review } from "@/models/review";
import { toPlainObject } from "lodash";
import dynamic from "next/dynamic";
import { BounceLoader } from "react-spinners";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CatastroResponse } from "@/models/catastro";
import {
  getCatastroDataFromAddressElements,
  getCoordinatesFromCatastroRef,
} from "@/helpers/catastroFunctions";
import cardBannerImage from "public/images/leave-review-banner.jpg";
import { decodeReadableURI, toTitleCase } from "@/helpers/stringHelpers";
import { Analysis } from "@/models/analysis";

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
  const [building, setBuilding] = useState<CatastroResponse | undefined>(
    undefined
  );
  const [analysis, setAnalysis] = useState<Analysis | undefined>(undefined);

  const t = useTranslations();

  const addr = toTitleCase(
    decodeReadableURI([address, number, municipality].join(", "))
  );

  useEffect(() => {
    const fetchData = async () => {
      /* console.log("address elements:", {
        locale,
        province,
        municipality,
        type,
        address,
        number,
      }); */

      try {
        const catastroData = await getCatastroDataFromAddressElements({
          province: decodeReadableURI(province),
          municipality: decodeReadableURI(municipality),
          type,
          street: decodeReadableURI(address),
          number,
        });

        if (!catastroData) {
          console.error("Building not found in catastro");
          setLoading(false);
          return;
        }

        const catastroRef = catastroData.response.bico
          ? catastroData.response.bico.identificacionBienInmueble
              .referenciaCatastral.edificio
          : catastroData.response.listaRegistroCatastral
          ? catastroData.response.listaRegistroCatastral.registros[0]
              .referenciaCatastral.edificio
          : null;


        if (!catastroRef) {
          console.error("No catastro ref in data");
          setLoading(false);
          return;
        }

        const coordinates = await getCoordinatesFromCatastroRef(catastroRef);
        const reviews: Review[] = await getReviewsByCatastroRef(catastroRef);

        if (catastroData && addr) {
          const neighbourhood = computeReviewsSummary(reviews);

          const analysisData = new Analysis({
            buildingId: catastroRef!,
            address: reviews.length > 0 ? reviews[0].address : addr,
            reviews: reviews.map((r) => toPlainObject(r)),
            latitude: coordinates!.coordinates[0].latitude,
            longitude: coordinates!.coordinates[0].longitude,
            neighbourhood,
          });

          setAnalysis(analysisData);
        }

        setBuilding(catastroData);
      } catch (error) {
        console.log("error fetching catastro data", error);
      }

      setLoading(false);
    };

    fetchData();
  }, [addr, locale, municipality, number, province, address, type]);
  /* 
  const building = await getBuildingByAddress(street, params.number);

  // const reviews = await getReviewsByBuidingId(params.buildingId);
  let reviews: Review[] = [];

  if (building?.id) {
    reviews = await getReviewsByBuidingId(building.id);
  }

  // Redirect if there's an error fetching the building
  if (!building) {
    console.error("Building not found");
  }

  // Construct the Analysis object once we have all the required data
  let analysis;

  if (building && reviews) {
    const neighbourhood = computeReviewsSummary(reviews);

    analysis = {
      buildingId: building.id,
      address: [
        building.address,
        building.number,
        capitalize(params.city),
      ].join(", "),
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
 */

  if (loading) {
    return (
      <MainLayout>
        <div className="top-0 left-0 flex justify-center items-center w-full h-[60vh] z-50 bg-white opacity-90">
          <BounceLoader color="#d8b4fe" size={140} />
        </div>
      </MainLayout>
    );
  }

  if (!building || !analysis) {
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
              {/* 0{building?.postalCode} /{" "} */}
              {building?.response.bico
                ? building.response.bico.localizacion.ubicacion.codigoPostal
                : building?.response.listaRegistroCatastral!.registros[0]
                    .localizacion.ubicacion.codigoPostal.length < 5
                ? "0" +
                  building?.response.listaRegistroCatastral?.registros[0]
                    .localizacion.ubicacion.codigoPostal
                : building?.response.listaRegistroCatastral?.registros[0]
                    .localizacion.ubicacion.codigoPostal}{" "}
              {/* {building?.neighbourhood.toLocaleUpperCase()} */}
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
