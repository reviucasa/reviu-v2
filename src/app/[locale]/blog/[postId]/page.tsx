"use client";
import { MainLayout } from "@/components/layouts/MainLayout";
import { PostView } from "@/components/organism/PostView";
import { Post, getPost } from "@/models/post";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BounceLoader } from "react-spinners";

export default function PostPage({ params }: { params: { postId: string } }) {
  const router = useRouter();

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
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="top-0 left-0 flex justify-center items-center w-full h-[100vh] z-50 bg-white opacity-90">
          <BounceLoader color="#d8b4fe" size={140} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto my-20 rounded-2xl p-8 bg-white">
        <PostView post={post} />
      </div>
    </MainLayout>
  );
}
