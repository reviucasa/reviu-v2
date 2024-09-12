import { getUrl } from "@/app/sitemap";
import { host, locales, pathnames } from "@/config";
import { getAgencies } from "@/models/agency";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let keys = Object.keys(pathnames) as Array<keyof typeof pathnames>;

  const agencies = await getAgencies();
  return agencies.map((a) => ({
    url: `${host}/agency/${encodeURIComponent(
      a.lowercase.replaceAll(" ", "-")
    )}`,
    lastModified: a.timeCreated.toDate(),
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, getUrl("/agency/[agency]", locale)])
      ),
    },
  }));
}
