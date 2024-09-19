import { MainLayout } from "@/components/layouts/MainLayout";
import { PostView } from "@/components/organism/PostView";
import { host } from "@/config";
import { formatFirebaseTimestamp } from "@/helpers/formatTimestamp";
import { getPost } from "@/models/post";
import { mainKeywords } from "@/staticData";
import { notFound } from "next/navigation";

import Logo from "public/images/reviuLogo.svg";

import { Space_Grotesk } from "next/font/google";
import NextImage from "next/image";

// Load Space Grotesk font
const space_grotesk = Space_Grotesk({ subsets: ["latin"] });

export async function generateMetadata({
  params: { locale, postId },
}: {
  params: { locale: string; postId: string };
}) {
  // Fetch blog post data using the postId
  const post = await getPost(postId);

  const p = post?.translations[locale as "en" | "ca" | "es"];

  const title =
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

  const keywords = [p?.title, ...mainKeywords(locale)];

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(`https://www.reviucasa.com/${locale}/blog/${postId}`),
    /* openGraph: {
      type: "article",
      url: `https://www.reviucasa.com/${locale}/blog/${postId}`,
      title: p?.title,
      description: p?.subtitle,
      image: post?.imageUrl,
      siteName: "Reviu",
      locale,
      images: [{ url: post?.imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: "https://www.reviucasa.com",
      title: p?.title,
      description: p?.subtitle,
      image: post?.imageUrl,
    }, */
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

  const imageUrl = post?.imageUrl;
  const p = post?.translations[params.locale as "en" | "ca" | "es"];

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto my-20 rounded-2xl p-8 bg-white">
        <div className="flex items-center justify-center w-full h-full bg-white p-6">
          {/* Card Container */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col items-center w-full h-full">
            {/* Post Image */}
            <div className="relative w-full h-2/3">
              <NextImage
                src={imageUrl}
                alt={p?.title ?? "Post image"}
                layout="fill"
                objectFit="cover"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Card Content */}
            <div className="p-4 flex flex-col items-start w-full h-1/3">
              {/* Post Title */}
              <h1
                className={`${space_grotesk.className} text-black text-3xl font-bold mb-2`}
              >
                {p?.title}
              </h1>

              {/* Reviucasa Logo */}
              <div className="w-24 mt-4">
                <NextImage
                  src={Logo}
                  alt="Reviucasa Logo"
                  width={100}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
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
