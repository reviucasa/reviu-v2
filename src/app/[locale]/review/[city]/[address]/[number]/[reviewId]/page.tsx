import { MainLayout } from "@/components/layouts/MainLayout";
import { ReviewDetail } from "@/components/organism/ReviewDetail";
import { getReview } from "@/models/review";
import { mainKeywords } from "@/staticData";
import { BounceLoader } from "react-spinners";

export async function generateMetadata({
  params: { locale, city, address, number, reviewId },
}: {
  params: {
    locale: string;
    city: string;
    address: string;
    number: string;
    reviewId: string;
  };
}) {
  const review = await getReview(reviewId);
  const reviewTitle = review?.data.opinion?.title;

  const addr = decodeURIComponent(address.replaceAll("-", " "));

  const title =
    locale == "en"
      ? `Review of ${addr} ${number}, ${city} - ${reviewTitle} | Reviu`
      : locale == "es"
      ? `Reseña de ${addr} - ${reviewTitle} | Reviu`
      : `Ressenya de ${addr} - ${reviewTitle} | Reviu`;

  const description =
    locale == "en"
      ? `Discover the review of ${addr}. See what others say about this rental on Reviu, and get detailed insights and information.`
      : locale == "es"
      ? `Descubre la reseña de ${addr} en Barcelona. Consulta opiniones de otros usuarios sobre esta propiedad en Reviu, y obtén información detallada.`
      : `Descobreix la ressenya de ${addr} a Barcelona. Consulta les opinions d'altres usuaris sobre aquesta propietat a Reviu, i obtén informació detallada.`;

  const keywords = [
    [addr, number, city].join(" "),
    ...mainKeywords(locale).slice(0, 3),
  ];

  const images = review?.data.opinion?.images;

  return {
    title,
    description,
    keywords,
    /* metadataBase: new URL(
      `https://www.reviucasa.com/${locale}/review/${city}/${address}/${number}/${reviewId}`
    ), */
    openGraph: {
      title,
      description,
      url: new URL(
        `https://www.reviucasa.com/review/${city}/${address}/${number}/${reviewId}`
      ),
      siteName: "Reviu",
      locale: locale,
      type: "article",
      images: [
        {
          url:
            images && images?.length > 0 && review?.data.opinion?.images[0].url,
        },
      ],
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
      images: [
        images && images?.length > 0 && review?.data.opinion?.images[0].url,
      ],
    },
  };
}

export default async function ReviewDetails({
  params: { locale, city, address, number, reviewId },
}: {
  params: {
    locale: string;
    city: string;
    address: string;
    number: string;
    reviewId: string;
  };
}) {
  const review = await getReview(reviewId);

  // Redirect if there's an error fetching the building
  if (!review) {
    console.error("Building not found");
    /* router.push("/"); */
  }

  if (!review) {
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
      <div className="lg:px-40 lg:py-16">
        <div className="p-6 lg:p-16 rounded-lg bg-white">
          <div className="flex justify-start mb-3">
            <h4 className="font-bold lg:block hidden ">
              {/* {t("common.detalleOpinion")}{" "} */}
              <span className="">
                {review.address.replace(", Espanya", "")}
              </span>
            </h4>
          </div>
          <ReviewDetail review={review} />
        </div>
      </div>
    </MainLayout>
  );
}
