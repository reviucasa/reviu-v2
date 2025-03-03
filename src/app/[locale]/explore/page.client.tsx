"use client";
import { getReviewsFromCoordinates, Review } from "@/models/review";

import { useEffect, useState } from "react";
import ExplorePage from "./pages/ExplorePage";
import { useRouter } from "next/navigation";

export default function NearbyExplorePageClient({
  searchParams,
}: {
  searchParams: { lat?: string; lng?: string };
}) {
  const router = useRouter();

  const latitude = searchParams.lat ? parseFloat(searchParams.lat) : null;
  const longitude = searchParams.lng ? parseFloat(searchParams.lng) : null;

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
        0.25
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
      title={"Reviews near you"}
      loading={loading}
      reviews={reviews}
      coordinates={{ latitude: latitude!, longitude: longitude! }}
      empty={reviews.length == 0}
    />
  );
}
