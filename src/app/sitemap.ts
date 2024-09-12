import { defaultLocale, host, locales, pathnames } from "@/config";
import { getPathname } from "@/navigation";
import { MetadataRoute } from "next";

const generateBlogPostsSitemapObjects = async () => {
  return [
    {
      slug: "com-funciona-la-regulacio-de-lloguers-",
      updatedAt: new Date(),
    },
    {
      slug: "com-saber-quant-pagava-lanterior-llogater-i-evitar-que-et-pugin-el-preu",
      updatedAt: new Date(),
    },
    {
      slug: "quants-mesos-de-fianca-et-poden-demanar-quan-llogues-un-pis",
      updatedAt: new Date(),
    },
  ];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let keys = Object.keys(pathnames) as Array<keyof typeof pathnames>;

  function getUrl(
    key: keyof typeof pathnames,
    locale: (typeof locales)[number]
  ) {
    const pathname = getPathname({
      locale,
      href: { pathname: key },
    });
    return `${host}/${locale}${pathname === "/" ? "" : pathname}`;
  }

  keys = keys.filter(
    (key) =>
      !key.includes("building") &&
      !key.includes("agency") &&
      !key.includes("review")
  );

  return [
    ...keys.map((key) => ({
      url: getUrl(key, defaultLocale),
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((locale) => [locale, getUrl(key, locale)])
        ),
      },
    })),
    ...(await generateBlogPostsSitemapObjects()).map((o) => ({
      url: `https://reviucasa.com/blog/${o.slug}`,
      lastModified: o.updatedAt,
      priority: 0.6,
    })),
  ];
}
