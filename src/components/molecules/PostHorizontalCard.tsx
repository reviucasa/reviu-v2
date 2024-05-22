import Image from "next/image";
import { Post, PostStatus } from "@/models/post";
import { classNames } from "@/helpers/classNames";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PostModalButton } from "../atoms/PostModalButton";
import { toPlainObject } from "lodash";
import { formatFirebaseTimestamp } from "@/helpers/formatTimestamp";
import { useLocale } from "next-intl";

export const PostHorizontalCard = async ({
  post,
  isModal,
}: {
  post: Post;
  isModal?: boolean;
}) => {
  // const [openPostModal, setOpenPostModal] = useState<boolean>(false);
  const locale = useLocale();
  const t = await getTranslations();

  return (
    <div
      className={classNames(
        "grid grid-cols-1 sm:grid-cols-12 bg-white rounded-2xl shadow-sm overflow-hidden ",
        post.status != PostStatus.archived ? "opacity-100" : "opacity-40"
      )}
    >
      <div className="sm:col-span-3 lg:col-span-4 bg-blue-200 max-h-52 sm:max-h-none">
        <Image
          src={post.imageUrl}
          className="object-cover h-full"
          width={600}
          height={600}
          alt="PostImage"
        />
      </div>
      <div className="sm:col-span-9 lg:col-span-8 p-6 ">
        <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
          {post.title}
        </h2>
        <section aria-labelledby="information-heading" className="mt-3 ">
          <h3 id="information-heading" className="sr-only">
            Description
          </h3>
          <p className="text-sm text-gray-700 max-h-20 text-ellipsis overflow-hidden">
            {post.subtitle}
          </p>
        </section>
        <section aria-labelledby="options-heading" className="mt-6 text-start">
          {/* <Button
            onClick={() => setOpenPostModal(!openPostModal)}
            className="btn-primary-500"
          >
            {t("blog.readme")}
          </Button> */}
          {isModal && (
            <PostModalButton
              post={{
                ...post,
                timeCreated: formatFirebaseTimestamp(post.timeCreated, locale, {
                  onlyDate: true,
                  ignoreYear: false,
                }),
                timeUpdated:
                  post.timeUpdated &&
                  formatFirebaseTimestamp(post.timeUpdated, locale, {
                    onlyDate: true,
                    ignoreYear: false,
                  }),
              }}
            />
          )}
          {!isModal && (
            <Link
              href={`blog/${post.id}`}
              className="text-primary-500 underline cursor-pointer hover:text-primary-300"
            >
              {t("common.verMás")}
            </Link>
          )}
        </section>
      </div>
      {/* <PostModal
        openModal={openPostModal}
        setOpenModal={setOpenPostModal}
        post={post}
      /> */}
    </div>
  );
};
