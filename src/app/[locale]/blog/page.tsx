"use client";
import { MainLayout } from "@/components/layouts/MainLayout";
import { PostHorizontalCard } from "@/components/molecules/PostHorizontalCard";
import { Post, PostStatus, getPosts } from "@/models/post";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Blog() {
  const t = useTranslations();

  const { data: posts } = useQuery<Post[] | undefined, Error>({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  return (
    <MainLayout>
      <div className="p-10">
        <h1 className="text-3xl py-4 font-semibold leading-6 text-gray-900">
          {t("blog.theBlog")}
        </h1>
        <div className="my-6 space-y-6 sm:max-w-3xl lg:max-w-4xl">
          {posts
            ?.filter((p) => p.status != PostStatus.archived)
            .slice(0, 3)
            ?.map((post) => (
              <PostHorizontalCard key={post.id} post={post} />
            ))}
        </div>
      </div>
    </MainLayout>
  );
}
