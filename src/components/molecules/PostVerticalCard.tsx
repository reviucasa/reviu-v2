import Image from "next/image";
import { Post } from "@/models/post";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function PostVerticalCard({ post }: { post: Post }) {
  const t = await getTranslations();
  return (
    <div className="grid grid-cols-1 bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="max-h-52">
        <Image
          src={post.imageUrl}
          className="object-cover h-full"
          width={600}
          height={600}
          alt="PostImage"
        />
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 sm:pr-12">
          {post.title}
        </h2>
        <section aria-labelledby="information-heading" className="mt-3">
          <h3 id="information-heading" className="sr-only">
            Description
          </h3>
          <p className="text-sm text-gray-700 max-h-20 overflow-hidden">
            <span className="inline-block max-h-full overflow-ellipsis">
              {post.subtitle}
            </span>
          </p>
        </section>
        <section aria-labelledby="options-heading" className="mt-6 text-start">
          {/* <PostVerticalCardClient post={post} /> */}
          <Link
            href={`blog/${post.id}`}
            title={post.id.replaceAll("-", " ").toLocaleUpperCase()}
            className="text-primary-500 underline cursor-pointer hover:text-primary-300"
          >
            {t("common.verMás")}
          </Link>
        </section>
      </div>
    </div>
  );
}
