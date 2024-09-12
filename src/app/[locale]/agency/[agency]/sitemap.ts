import { host } from "@/config";
import { getAgencies } from "@/models/agency";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agencies = await getAgencies();
  return agencies.map((a) => ({
    url: `${host}/agency/${encodeURIComponent(
      a.lowercase.replaceAll(" ", "-")
    )}`,
    lastModified: a.timeCreated.toDate(),
  }));
}
