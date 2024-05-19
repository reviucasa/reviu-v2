import { MainLayout } from "@/components/layouts/MainLayout";
import { PostView } from "@/components/organism/PostView";
import { formatFirebaseTimestamp } from "@/helpers/formatTimestamp";
import { getPost } from "@/models/post";
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: { postId: string };
}) {
  const locale = useLocale();
  /* const router = useRouter();

  const {
    data: post,
    isError,
    error,
  } = useQuery<Post | undefined, Error>({
    queryKey: ["post", params.postId],
    queryFn: () => getPost(decodeURIComponent(params.postId)),
  });

  if (isError) {
    console.error(error);
    router.push("/");
  } */

  const post = await getPost(decodeURIComponent(params.postId));

  if (!post) {
    notFound();
    /* return (
      <MainLayout>
        <div className="top-0 left-0 flex justify-center items-center w-full h-[100vh] z-50 bg-white opacity-90">
          <BounceLoader color="#d8b4fe" size={140} />
        </div>
      </MainLayout>
    ); */
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto my-20 rounded-2xl p-8 bg-white">
        <PostView
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
      </div>
    </MainLayout>
  );
}
