import { MainLayout } from "@/components/layouts/MainLayout";
import { PostView } from "@/components/organism/PostView";
import { formatFirebaseTimestamp } from "@/helpers/formatTimestamp";
import { getPost } from "@/models/post";
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params: { locale, postId },
}: {
  params: { locale: string; postId: string };
}) {
  // Fetch blog post data using the postId
  const post = await getPost(postId);

  const p = post?.translations[locale as "en" | "ca" | "es"];

  const titleDetail =
    locale == "en"
      ? `Reviu Post: ${p?.title}`
      : locale == "es"
      ? `Reviu: ${p?.title}`
      : `Reviu: ${p?.title}`;

  const description =
    locale == "en"
      ? `${p?.subtitle} - Read more on Reviu.`
      : locale == "es"
      ? `${p?.subtitle} - Lee más en Reviu.`
      : `${p?.subtitle} - Llegeix més a Reviu.`;

  return {
    title: titleDetail,
    description,
  };
}

export default async function PostPage({
  params,
}: {
  params: { locale: string; postId: string };
}) {
  // const locale = useLocale();

  const post = await getPost(params.postId);

  if (!post) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto my-20 rounded-2xl p-8 bg-white">
        <PostView
          post={{
            ...post,
            timeCreated: formatFirebaseTimestamp(
              post.timeCreated,
              params.locale,
              {
                onlyDate: true,
                ignoreYear: false,
              }
            ),
            timeUpdated:
              post.timeUpdated &&
              formatFirebaseTimestamp(post.timeUpdated, params.locale, {
                onlyDate: true,
                ignoreYear: false,
              }),
          }}
        />
      </div>
    </MainLayout>
  );
}
