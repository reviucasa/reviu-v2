import { getPost } from "@/models/post";
import { ImageResponse } from "next/og";
import NextImage from "next/image";

export const runtime = "edge";

// Image metadata
export const alt = "Post image";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image({
  params: { locale, postId },
}: {
  params: { locale: string; postId: string };
}) {
  const post = await getPost(postId);
  const imageUrl = post?.imageUrl;
  const p = post?.translations[locale as "en" | "ca" | "es"];

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div className="relative w-full h-full">
        <NextImage
          src={imageUrl!}
          alt={p?.title ?? "Post image"}
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
