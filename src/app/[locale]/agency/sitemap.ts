import { getUrl } from "@/app/sitemap";
import { host, locales, pathnames } from "@/config";
import { getAgencies } from "@/models/agency";
import type { MetadataRoute } from "next";

const chunkSize = 50000;

export async function generateSitemaps() {
  const agencies = await getAgencies();

  // Calculate how many sitemaps are needed
  const totalSitemaps = Math.ceil(agencies.length / chunkSize);

  // Create an array of sitemaps, each with its own id
  const sitemaps = Array.from({ length: totalSitemaps }, (_, index) => ({
    id: index,
  }));

  return sitemaps;
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const agencies = await getAgencies(id, chunkSize);
  return agencies.map((a) => ({
    url: `${host}/agency/${encodeURIComponent(
      a.lowercase.replaceAll(" ", "-")
    )}`,
    lastModified: a.timeCreated.toDate(),
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          getUrl(
            `/agency/${encodeURIComponent(a.lowercase.replaceAll(" ", "-"))}`,
            locale
          ),
        ])
      ),
    },
  }));
}
