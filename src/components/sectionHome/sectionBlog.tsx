import Image from "next/image";
import circulosection from "public/images/circulosection.svg";
import { PostStatus, getPosts } from "@/models/post";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import PostVerticalCard from "../molecules/PostVerticalCard";

export async function SectionBlog() {
  const t = await getTranslations();
  const tLinks = await getTranslations("linksTitles");

  const posts = await getPosts();

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
      <Link className="btn btn-primary-500 mt-14" href="/blog" title={tLinks("/blog")}>
        {t("blog.seeAll")}
      </Link>
    </div>
  );
}
