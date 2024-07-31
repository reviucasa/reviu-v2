import { MainLayout } from "@/components/layouts/MainLayout";
import { BannerOpinion } from "@/components/molecules/BannerOpinion";
import { PostHorizontalCard } from "@/components/molecules/PostHorizontalCard";
import { PostStatus, getPosts } from "@/models/post";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Head from "next/head";
import cardBannerImage from "public/images/kid-reading.jpg";
import { locales } from "../layout";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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

  return {
    title: titleDetail,
    description,
    openGraph: {
      type: "article",
      url: `https://www.reviucasa.com/${locale}/blog`,
      title: titleDetail,
      subtitle: description,
      image: "https://www.reviucasa.com/images/message.png",
      siteName: "Reviu",
      locale,
      images: [
        {
          url: "https://www.reviucasa.com/images/message.png",
          width: 300,
          height: 300,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "https://www.reviucasa.com",
      title: titleDetail,
      description: description,
      image: "https://www.reviucasa.com/images/message.png",
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
      <Head>
        <title>Reviu Blog</title>
        <meta name="robots" content="all" />
      </Head>
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
