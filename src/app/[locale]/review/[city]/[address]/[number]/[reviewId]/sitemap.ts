import { host } from "@/config";
import { getAllReviews, getReviews } from "@/models/review";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const reviews = await getAllReviews();
  return reviews.map((r) => {
    const [street, number, city, _] = r.address.split(", ");
    return {
      url: `${host}/review/${encodeURIComponent(
        city.replaceAll(" ", "-")
      )}/${encodeURIComponent(street.replaceAll('-', ' '))}/${number}/${r.id}`,
      lastModified: r.timeUpdated.toDate(),
    };
  });
}
