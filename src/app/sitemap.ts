/* import { MetadataRoute } from "next";

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
  return [
    {
      url: "https://reviucasa.com",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://reviucasa.com/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...(await generateBlogPostsSitemapObjects()).map((o) => ({
      url: `https://reviucasa.com/blog/${o.slug}`,
      lastModified: o.updatedAt,
      priority: 0.6,
    })),
    {
      url: "https://reviucasa.com/about",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "https://reviucasa.com/account",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: "https://reviucasa.com/admin",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: "https://reviucasa.com/cookies",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: "https://reviucasa.com/faqs",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://reviucasa.com/legalNotice",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: "https://reviucasa.com/privacyPolicy",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: "https://reviucasa.com/newReview",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: "https://reviucasa.com/newReview/address",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://reviucasa.com/newReview/community",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://reviucasa.com/newReview/management",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://reviucasa.com/newReview/neighbourhood",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://reviucasa.com/newReview/opinion",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://reviucasa.com/newReview/stay",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://reviucasa.com/newReview/valuation",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://reviucasa.com/success",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: "https://reviucasa.com/suspended",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.1,
    },
  ];
}
 */

import { defaultLocale, host, locales, pathnames } from "@/config";
import { getPathname } from "@/navigation";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const keys = Object.keys(pathnames) as Array<keyof typeof pathnames>;

  function getUrl(
    key: keyof typeof pathnames,
    locale: (typeof locales)[number]
  ) {
    const pathname = getPathname({ locale, href: key });
    return `${host}/${locale}${pathname === "/" ? "" : pathname}`;
  }

  return keys.map((key) => ({
    url: getUrl(key, defaultLocale),
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, getUrl(key, locale)])
      ),
    },
  }));
}
