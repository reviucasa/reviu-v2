import { defaultLocale, host, locales, pathnames } from "@/config";
import { getPosts } from "@/models/post";
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
      url: `${host}/${p.id}`,
      updatedAt: p.timeUpdated ?? p.timeCreated,
      alternates: {
        languages: Object.fromEntries(
          locales.map((locale) => [locale, `${host}/${locale}/${p.id}`])
        ),
      },
    };
  });
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
      url: `${host}/${key}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((locale) => [locale, getUrl(key, locale)])
        ),
      },
    })),
    ...(await generateBlogPostsSitemapObjects()),
  ];
}
