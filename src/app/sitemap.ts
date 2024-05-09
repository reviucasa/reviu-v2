import { MetadataRoute } from "next";

const generateBlogPostsSitemapObjects = async () => {
  return [
    {
      slug: "barcelona-al-descobert-la-teva-guia-per-trobar-el-pis-perfecte",
      updatedAt: new Date(),
    },
    {
      slug: "consells-clau-per-negociar-el-teu-contracte-de-lloguer",
      updatedAt: new Date(),
    },
    {
      slug: "que-ens-poden-demanar-i-que-no-les-immobiliaries",
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
    })),
  ];
}
