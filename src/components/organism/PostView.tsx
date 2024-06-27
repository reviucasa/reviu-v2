import { PostStatus } from "@/models/post";
import Image from "next/image";
import { PostShareButton } from "../atoms/PostShareButton";
import PostViewActions from "../atoms/PostViewActions";
import { classNames } from "@/helpers/classNames";
import { useLocale } from "next-intl";

export type PostPlain = {
  id: string;
  translations: {
    ca: {
      title: string;
      subtitle: string | null;
      content: string;
    };
    es: {
      title: string;
      subtitle: string | null;
      content: string;
    };
    en: {
      title: string;
      subtitle: string | null;
      content: string;
    };
  };
  timeCreated: string;
  timeUpdated?: string;
  imageUrl: string;
  status?: PostStatus;
};

export const PostView = ({ post }: { post: PostPlain }) => {
  const locale = useLocale();
  const p = post.translations[locale as "en" | "ca" | "es"]

  return (
    <div className=" bg-white  ">
      <div
        className={classNames(
          post.status != PostStatus.archived ? "opacity-100" : "opacity-40",
          "flex flex-col space-y-10 p-4 md:p-10"
        )}
      >
        <h2 className="text-4xl font-bold text-gray-900 ">{p.title}</h2>
        <div className="flex justify-between items-end">
          <p className="text-xs text-gray-400 ">{post.timeCreated}</p>
          <PostShareButton post={post} />
        </div>
        <p className=" text-gray-600 ">{p.subtitle}</p>
        <Image
          src={post.imageUrl}
          className="w-full max-h-96 object-cover max-w-3xl mx-auto rounded-xl"
          width={600}
          height={600}
          alt="PostImage"
          priority
        />
        <div
          className="text-gray-900 post-content"
          dangerouslySetInnerHTML={{ __html: p.content }}
        />
      </div>
      {/* client */}
      <PostViewActions post={post} />
    </div>
  );
};
