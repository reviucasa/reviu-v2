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
  return [
    {
      url: "https://reviu.vercel.app",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://reviu.vercel.app/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...(await generateBlogPostsSitemapObjects()).map((o) => ({
      url: `https://reviu.vercel.app/blog/${o.slug}`,
      lastModified: o.updatedAt,
      priority: 0.6,
    })),
    {
      url: "https://reviu.vercel.app/about",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "https://reviu.vercel.app/account",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: "https://reviu.vercel.app/admin",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: "https://reviu.vercel.app/cookies",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: "https://reviu.vercel.app/faqs",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://reviu.vercel.app/legalNotice",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: "https://reviu.vercel.app/privacyPolicy",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: "https://reviu.vercel.app/review",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: "https://reviu.vercel.app/review/address",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://reviu.vercel.app/review/community",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://reviu.vercel.app/review/management",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://reviu.vercel.app/review/neighbourhood",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://reviu.vercel.app/review/opinion",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://reviu.vercel.app/review/stay",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://reviu.vercel.app/review/valuation",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://reviu.vercel.app/success",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: "https://reviu.vercel.app/suspended",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.1,
    },
  ];
}
