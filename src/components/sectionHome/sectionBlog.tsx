"use client";
import Image from "next/image";
import circulosection from "public/images/circulosection.svg";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Post, PostStatus, getPosts } from "@/models/post";
import { useQuery } from "@tanstack/react-query";
import { PostVerticalCard } from "../molecules/PostVerticalCard";
import { Button } from "../atoms/Button";

export function SectionBlog() {
  const t = useTranslations();
  const router = useRouter();

  const { data: posts } = useQuery<Post[] | undefined, Error>({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  return (
    <div className="flex flex-col items-center my-4">
      <div className="flex justify-center">
        <p className="flex self-center absolute text-xs font-bold uppercase">
          {t("blog.dingDong")}
        </p>
        <Image src={circulosection} alt="" width={152} className="h-auto" />
      </div>
      <div className="flex justify-center mt-6 mb-14 ">
        <h2 className="xs:text-2xl">{t("blog.findOutTips")}</h2>
      </div>
      <div className="w-full relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:gap-4 md:gap-6 ">
        {posts &&
          posts
            .filter((p) => p.status != PostStatus.archived)
            .slice(0, 3)
            .map((p) => <PostVerticalCard key={p.id} post={p} />)}
      </div>
      <Button
        className="btn-primary-500 mt-14"
        onClick={() => router.push("/blog")}
      >
        {t("blog.seeAll")}
      </Button>
    </div>
  );
}
