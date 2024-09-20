import { MainLayout } from "@/components/layouts/MainLayout";
import { BannerOpinion } from "@/components/molecules/BannerOpinion";
import { PostHorizontalCard } from "@/components/molecules/PostHorizontalCard";
import { host, locales } from "@/config";
import { PostStatus, getPosts } from "@/models/post";
import { mainKeywords } from "@/staticData";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import cardBannerImage from "public/images/kid-reading.jpg";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const titleDetail =
    locale == "en"
      ? "Reviu Blog: Latest Posts and Updates"
      : locale == "es"
      ? "Blog de Reviu: Últimas publicaciones y actualizaciones"
      : "Blog de Reviu: Últimes publicacions i actualitzacions";

  const description =
    locale == "en"
      ? "Explore the latest posts and updates on the Reviu blog. Stay informed with our latest news, tips, and insights on finding the best rental homes in Barcelona."
      : locale == "es"
      ? "Explora las últimas publicaciones y actualizaciones en el blog de Reviu. Mantente informado con nuestras últimas noticias, consejos y perspectivas sobre cómo encontrar las mejores viviendas de alquiler en Barcelona."
      : "Explora les últimes publicacions i actualitzacions al blog de Reviu. Mantén-te informat amb les nostres últimes notícies, consells i perspectives sobre com trobar els millors habitatges de lloguer a Barcelona.";

  const keywords = [...mainKeywords(locale)];

  return {
    title: titleDetail,
    description,
    keywords,
    openGraph: {
      title: titleDetail,
      description,
      url: `https://www.reviucasa.com/blog`,
      siteName: "Reviu",
      locale: locale,
      type: "website",
      images: [
        {
          url: "https://www.reviucasa.com/images/blog-opengraph-image.png",
        },
      ],
    },
    twitter: {
      title: titleDetail,
      description,
      card: "summary_large_image",
      images: ["https://www.reviucasa.com/images/blog-opengraph-image.png"],
    },
  };
}

export const revalidate = 3600;

export default async function Blog({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations();

  const posts = await getPosts();

  return (
    <MainLayout>
      <div className="lg:px-16 px-4 pt-10 pb-20 ">
        <h3>{t("blog.theBlog")}</h3>
        <div className="relative grid lg:grid-cols-[1fr_auto] lg:gap-8 md:gap-4 grid-cols-1 lg:pt-10 pt-4">
          <div className="w-full">
            <div className="space-y-6 sm:max-w-3xl lg:max-w-4xl">
              {posts
                ?.filter((p) => p.status != PostStatus.archived)
                // .slice(0, 3)
                ?.map((post) => (
                  <PostHorizontalCard key={post.id} post={post} />
                ))}
            </div>
          </div>
          <div className="w-auto">
            <div className="w-auto hidden md:block">
              <BannerOpinion
                className="sticky top-10"
                text={t("blog.gotIdeas")}
                textColor="black"
                textButton={t("agency.contactaNosotros")}
                colorButton="btn-secondary-500"
                bgCard="bg-secondary-300/40"
                image={cardBannerImage}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
