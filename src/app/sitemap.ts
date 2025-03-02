import { host, locales, pathnames } from "@/config";
import { getAgencies } from "@/models/agency";
import { getPosts } from "@/models/post";
import { getAllReviews } from "@/models/review";
import { getPathname } from "@/navigation";
import { provincesData } from "@/staticData";
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

  return reviews.filter((r) => r.location?.province && r.location?.municipality).map((r) => {
    return {
      url: `${host}/review/${r.location!.province}/${
        r.location!.municipality
      }/${r.location!.street}/${r.location!.number}/${r.id}`,
      lastModified: r.timeCreated.toDate(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((locale) => [
            locale,
            getUrl(
              `/review/${r.location!.province}/${r.location!.municipality}/${
                r.location!.street
              }/${r.location!.number}/${r.id}`,
              locale
            ),
          ])
        ),
      },
    };
  });
};

const generateExploreSitemapObject = async () => {
  const provinces = Object.keys(provincesData);

  return provinces.flatMap((province) => {
    if (!province) return []; // Skip if province is undefined

    const provinceSlug = encodeURIComponent(
      province.toLowerCase().replace(/\s+/g, "-")
    );
    const provinceUrl = `${host}/explore/${provinceSlug}/`;

    const municipalities = provincesData[province] || [];

    const municipalityUrls = municipalities
      .filter((municipality) => municipality) // Ensure municipality is valid
      .map((municipality) => {
        const municipalitySlug = encodeURIComponent(
          municipality.toLowerCase().replace(/\s+/g, "-")
        );
        return {
          url: `${host}/explore/${provinceSlug}/${municipalitySlug}/`,
          lastModified: new Date(),
          alternates: {
            languages: Object.fromEntries(
              locales.map((locale) => [
                locale,
                getUrl(`/explore/${provinceSlug}/${municipalitySlug}`, locale),
              ])
            ),
          },
        };
      });

    return [
      {
        url: provinceUrl,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(
            locales.map((locale) => [
              locale,
              getUrl(`/explore/${provinceSlug}`, locale),
            ])
          ),
        },
      },
      ...municipalityUrls,
    ];
  });
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let keys = Object.keys(pathnames) as Array<keyof typeof pathnames>;

  keys = keys.filter(
    (key) =>
      !key.includes("building") &&
      !key.includes("agency") &&
      !key.includes("review") &&
      !key.includes("explore")
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
    ...(await generateExploreSitemapObject()),
  ];
}
