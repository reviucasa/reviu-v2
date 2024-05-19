import { MainLayout } from "@/components/layouts/MainLayout";
import { BannerOpinion } from "@/components/molecules/BannerOpinion";
import { PostHorizontalCard } from "@/components/molecules/PostHorizontalCard";
import { PostStatus, getPosts } from "@/models/post";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Head from "next/head";
import cardBannerImage from "public/images/kid-reading.jpg";

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
                .slice(0, 3)
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
