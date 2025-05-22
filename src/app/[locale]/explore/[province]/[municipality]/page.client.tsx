"use client";
import {
  Coordinates,
  getReviewsFromMunicipality,
  Review,
} from "@/models/review";
import { useEffect, useState } from "react";
import ExplorePage from "../../pages/ExplorePage";
import { toTitleCase } from "@/helpers/stringHelpers";
import { getMunicipalityCoordinates } from "@/helpers/getMunicipalityCoordinates";
import { useTranslations } from "next-intl";

export default function MunicipalityExplorePageClient({
  params: { province, municipality },
}: {
  params: {
    locale: string;
    province: string;
    municipality: string;
  };
}) {
  const t = useTranslations();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: 41.3874,
    longitude: 2.1686,
  });

  const fetchReviews = async () => {
    setLoading(true);

    try {
      const response = await getReviewsFromMunicipality(
        decodeURIComponent(province),
        decodeURIComponent(municipality)
      );

      if (response.length == 0) {
        setReviews([]);
      } else {
        setReviews(response);
      }
      const mCoordinates = await getMunicipalityCoordinates(
        municipality,
        province
      );
      if (mCoordinates != null) {
        setCoordinates({
          latitude: mCoordinates.lat,
          longitude: mCoordinates.lng,
        });
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchReviews();
    }, 1500);
  }, []);

  return (
    <ExplorePage
      title={`${t("common.reviews")} ${t("common.in")} ${toTitleCase(
        decodeURIComponent(municipality).replaceAll("-", " ")
      )}, ${toTitleCase(decodeURIComponent(province))}`}
      loading={loading}
      reviews={reviews}
      coordinates={coordinates!}
    />
  );
}
