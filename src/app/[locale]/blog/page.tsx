"use client";
import { MainLayout } from "@/components/layouts/MainLayout";
import { BannerOpinion } from "@/components/molecules/BannerOpinion";
import { PostHorizontalCard } from "@/components/molecules/PostHorizontalCard";
import { Post, PostStatus, getPosts } from "@/models/post";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import cardBannerImage from "public/kid-reading.jpg";

export default function Blog() {
  const t = useTranslations();

  const { data: posts } = useQuery<Post[] | undefined, Error>({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  return (
    <MainLayout>
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
