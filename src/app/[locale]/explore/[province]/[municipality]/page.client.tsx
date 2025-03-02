"use client";
import {
  Coordinates,
  getReviewsFromCoordinates,
  getReviewsFromMunicipality,
  Review,
  ReviewStatus,
} from "@/models/review";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ExplorePage from "../../pages/ExplorePage";
import { toTitleCase } from "@/helpers/stringHelpers";
import { getLocationFromIP } from "@/helpers/getLocationFromIP";
import { getMunicipalityCoordinates } from "@/helpers/getMunicipalityCoordinates";

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
  const [empty, setEmpty] = useState<boolean>(false);

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
        setEmpty(true);
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
        setEmpty(true);
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
      title={`Reviews in ${toTitleCase(
        decodeURIComponent(municipality).replaceAll("-", " ")
      )}, ${toTitleCase(decodeURIComponent(province))}`}
      loading={loading}
      reviews={reviews}
      coordinates={coordinates!}
      empty={empty}
    />
  );
}
