"use client";
import { getReviewsFromCoordinates, Review } from "@/models/review";

import { useEffect, useState } from "react";
import ExplorePage from "./pages/ExplorePage";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function NearbyExplorePageClient({
  searchParams,
}: {
  searchParams: { lat?: string; lng?: string; name?: string };
}) {
  const router = useRouter();
  const t = useTranslations();

  const latitude = searchParams.lat ? parseFloat(searchParams.lat) : null;
  const longitude = searchParams.lng ? parseFloat(searchParams.lng) : null;
  const name = searchParams.name ? decodeURIComponent(searchParams.name) : null;

  if (latitude == null || longitude == null) {
    router.push("/");
  }

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReviews = async () => {
    setLoading(true);

    try {
      const response = await getReviewsFromCoordinates(
        latitude!,
        longitude!,
        0.2
      );
      setReviews(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <ExplorePage
      title={`${t("common.reviews")} ${
        name != null ? t("common.in") + " " + name : t("common.nearYou")
      }`}
      loading={loading}
      reviews={reviews}
      coordinates={{ latitude: latitude!, longitude: longitude! }}
      fromCoordinates={true}
    />
  );
}
