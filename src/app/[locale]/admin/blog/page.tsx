"use client";
import AdminLayout from "@/components/layouts/AdminLayout";
import { PostHorizontalCard } from "@/components/molecules/PostHorizontalCard";
import { Post, getPosts } from "@/models/post";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data: posts } = useQuery<Post[] | undefined, Error>({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  return (
    <AdminLayout>
      <div className="">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Posts
          </h1>
        </div>
        <div className="my-6 space-y-6 sm:max-w-3xl lg:max-w-4xl">
          {posts?.map((post) => (
            <PostHorizontalCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
