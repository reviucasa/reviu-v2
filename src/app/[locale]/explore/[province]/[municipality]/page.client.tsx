"use client";
import { getReviewsFromUser, Review, ReviewStatus } from "@/models/review";
import dynamic from "next/dynamic";
import { BounceLoader } from "react-spinners";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import OpenStreetMapMultiple from "@/components/molecules/OpenStreetMapMultiple";
import { OpinionCardSmall } from "@/components/molecules/OpinionCardSmall";
import { toTitleCase } from "@/helpers/stringHelpers";

// Dynamically import the MainLayout component
const MainLayout = dynamic(() => import("@/components/layouts/MainLayout"), {
  ssr: false,
});

export default function AreaPageClient({
  params: { province, municipality },
}: {
  params: {
    locale: string;
    province: string;
    municipality: string;
  };
}) {
  console.log(municipality, province);
  const t = useTranslations();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReviews = async () => {
    setLoading(true);

    try {
      const response = await getReviewsFromUser(auth.currentUser!.uid);
      setReviews(response);
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

  return (
    <MainLayout>
      <div className="lg:p-10 p-4 mb-10 lg:mb-0">
        <div className=" relative lg:gap-8 md:gap-4 ">
          <h1 className="text-2xl lg:text-3xl  font-secondary">
            Reviews in {toTitleCase(municipality)}, {toTitleCase(province)}
          </h1>
          <p className="text-sm tracking-widest">
            {reviews.filter((r) => r.status == ReviewStatus.Published).length}
            {" reviews in total"}
          </p>
          <div className="flex flex-col lg:flex-row w-full mt-8 bg-white rounded-2xl">
            <div className="lg:hidden h-[400px] w-full center pt-8 px-8 ">
              {!loading ? (
                <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg">
                  <BounceLoader color="#d8b4fe" size={100} />
                  {/* 
                <OpenStreetMapMultiple reviews={reviews} zoom={12} />
                  */}
                </div>
              ) : (
                <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg">
                  <BounceLoader color="#d8b4fe" size={100} />
                </div>
              )}
            </div>
            <div className="relative lg:hidden mx-8 mt-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-sm text-gray-400">
                  Reviews
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-[480px] lg:flex lg:flex-col lg:space-y-4 lg:gap-0 lg:w-[424px] lg:h-[720px] overflow-y-auto py-8 px-8">
              {!loading ? (
                publishedReviews.map((review) => (
                  <OpinionCardSmall
                    key={review.id}
                    review={review}
                    sizeCard={360}
                  />
                ))
              ) : (
                <div className="flex justify-center items-center py-40 w-full lg:w-[392px] h-full">
                  <BounceLoader color="#d8b4fe" size={100} />
                </div>
              )}
            </div>
            <div className="hidden lg:block h-96 sm:h-[720px] flex-grow center align-middle p-8 pl-4">
              {false ? (
                <div className="flex justify-center items-center py-40 w-full h-full bg-gray-100 rounded-lg">
                  <BounceLoader color="#d8b4fe" size={100} />
                  {/* <OpenStreetMapMultiple reviews={reviews} zoom={12} /> */}
                </div>
              ) : (
                <div className="flex justify-center items-center py-40 w-full h-full bg-gray-100 rounded-lg">
                  <BounceLoader color="#d8b4fe" size={100} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

/* 
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
*/
