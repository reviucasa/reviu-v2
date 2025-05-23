"use client";
import { getReviewsFromUser, Review, ReviewStatus } from "@/models/review";
import { OpinionCard } from "@/components/molecules/OpinionCard";
import { auth } from "@/firebase/config";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import OpenStreetMapMultiple from "@/components/molecules/OpenStreetMapMultiple";
import { capitalize } from "lodash";
import { BounceLoader } from "react-spinners";
import Link from "next/link";
import Image from "next/image";
import img from "public/images/writeDrawing.png";

export default function MyReviewsClientPage() {
  const t = useTranslations();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [highlightedReviewId, setHighlightedReviewId] = useState<string | null>(
    null
  );

  const fetchReviews = async () => {
    setLoading(true);

    try {
      const response = await getReviewsFromUser(auth.currentUser!.uid);
      setReviews(response.filter((r) => r.location));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchReviews();
    }, 1500);
  }, []);

  const publishedReviews = reviews.filter(
    (r) => r.status == ReviewStatus.Published
  );

  const reportedReviews = reviews.filter(
    (r) => r.status == ReviewStatus.Reported
  );

  const suspendedReviews = reviews.filter(
    (r) => r.status == ReviewStatus.Suspended
  );

  return (
    <div className="relative lg:gap-8 md:gap-4 ">
      <h1 className="text-2xl lg:text-3xl  font-secondary">
        {t("common.myReviews")}
      </h1>
      <p className="text-sm tracking-widest">
        {reviews.filter((r) => r.status == ReviewStatus.Published).length}{" "}
        {t("common.publishedReviews")}
      </p>
      <div className=" h-72 sm:h-[480px] w-full my-10 center align-middle">
        {reviews.length > 0 ? (
          <OpenStreetMapMultiple
            reviews={reviews}
            zoom={15}
            highlightedReviewId={highlightedReviewId}
            setHighlightedReviewId={setHighlightedReviewId}
            showPin={false}
          />
        ) : loading ? (
          <div className="flex justify-center items-center py-40">
            <BounceLoader color="#d8b4fe" size={100} />
          </div>
        ) : (
          <div className="flex justify-between space-x-10">
            <div className="flex-col justify-center items-center w-full space-y-8">
              <p>{t("slide.titleWriteOpinion")}.</p>
              <p>{t("stayReview.informacionAnonima")}</p>
              <div>
                <Link
                  className={`btn mt-20 btn-primary-500 content-center overflow-hidden !w-full`}
                  href={"/newReview"}
                >
                  {t("common.escribeOpinion")}
                </Link>
              </div>
            </div>
            <div className="hidden md:flex w-full justify-start ">
              <div className="relative w-full max-w-96 scale-x-[-1] scale-y-[-1] ">
                <Image
                  src={img}
                  sizes="auto"
                  fill
                  alt=""
                  className=" object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {publishedReviews.map((review) => (
        <OpinionCard
          key={review.id}
          className="my-6"
          review={review}
          openInModal={true}
        />
      ))}

      {reportedReviews.length > 0 && (
        <>
          <h2 className="h-plain text-base lg:text-xl">
            {capitalize(t("common.reportedReviews"))} ({reportedReviews.length})
          </h2>
          {reportedReviews.map((review) => (
            <OpinionCard
              key={review.id}
              className="my-6"
              review={review}
              openInModal={true}
            />
          ))}
        </>
      )}

      {suspendedReviews.length > 0 && (
        <>
          <h2 className="h-plain text-base lg:text-xl">
            {capitalize(t("common.suspendedReviews"))} (
            {suspendedReviews.length})
          </h2>
          {suspendedReviews.map((review) => (
            <OpinionCard
              key={review.id}
              className="!p-0 !m-0"
              review={review}
              openInModal={true}
            />
          ))}
        </>
      )}
    </div>
  );
}
