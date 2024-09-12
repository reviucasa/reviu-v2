import { host, locales, pathnames } from "@/config";
import { getAgencies } from "@/models/agency";
import { getPosts } from "@/models/post";
import { getAllReviews } from "@/models/review";
import { getPathname } from "@/navigation";
import { MetadataRoute } from "next";

export function getUrl(
  key: keyof typeof pathnames,
  locale: (typeof locales)[number]
) {
  const pathname = getPathname({
    locale,
    href: { pathname: key },
  });
  return `${host}/${locale}${pathname === "/" ? "" : pathname}`;
}

const generateBlogPostsSitemapObjects = async () => {
  const posts = await getPosts();

  return posts.map((p) => {
    return {
      url: `${host}/blog/${p.id}`,
      lastModified: p.timeUpdated?.toDate() ?? p.timeCreated.toDate(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((locale) => [locale, `${host}/${locale}/blog/${p.id}`])
        ),
      },
    };
  });
};

const generateAgenciesSitemapObjects = async () => {
  const agencies = await getAgencies();

  return agencies.map((a) => ({
    url: `${host}/agency/${encodeURIComponent(
      a.lowercase.replaceAll(" ", "-")
    )}`,
    lastModified: new Date(),
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
};

const generateReviewsSitemapObjects = async () => {
  const reviews = await getAllReviews();

  return reviews.map((r) => ({
    url: `${host}/review/barcelona/${encodeURIComponent(
      r.address.split(", ")[0].replaceAll(" ", "-")
    )}/${r.address.split(", ")[1]}/${r.id}`,
    lastModified: r.timeCreated.toDate(),
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          getUrl(
            `/review/barcelona/${encodeURIComponent(
              r.address.split(", ")[0].replaceAll(" ", "-")
            )}/${r.address.split(", ")[1]}/${r.id}`,
            locale
          ),
        ])
      ),
    },
  }));
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let keys = Object.keys(pathnames) as Array<keyof typeof pathnames>;

  keys = keys.filter(
    (key) =>
      !key.includes("building") &&
      !key.includes("agency") &&
      !key.includes("review")
  );

  return [
    ...keys.map((key) => ({
      url: `${host}${key}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((locale) => [locale, getUrl(key, locale)])
        ),
      },
    })),
    ...(await generateBlogPostsSitemapObjects()),
    ...(await generateReviewsSitemapObjects()),
    ...(await generateAgenciesSitemapObjects()),
  ];
}
