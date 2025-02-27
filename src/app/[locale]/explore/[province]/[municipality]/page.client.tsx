"use client";
import {
  Coordinates,
  getReviewsFromCoordinates,
  getReviewsFromMunicipality,
  Review,
  ReviewStatus,
} from "@/models/review";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ExplorePage from "../../pages/ExplorePage";
import { toTitleCase } from "@/helpers/stringHelpers";
import { getLocationFromIP } from "@/helpers/getLocationFromIP";
import { getMunicipalityCoordinates } from "@/helpers/getMunicipalityCoordinates";

export default function MunicipalityExplorePageClient({
  params: { province, municipality },
}: {
  params: {
    locale: string;
    province: string;
    municipality: string;
  };
}) {
  const t = useTranslations();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [empty, setEmpty] = useState<boolean>(false);

  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: 41.3874,
    longitude: 2.1686,
  });

  const fetchReviews = async () => {
    setLoading(true);

    try {
      const response = await getReviewsFromMunicipality(decodeURIComponent( province), decodeURIComponent( municipality));

      if (response.length == 0) {
        setEmpty(true);
        const mCoordinates = await getMunicipalityCoordinates(
          municipality,
          province
        );
        if (mCoordinates != null) {
          setCoordinates({
            latitude: mCoordinates.lat,
            longitude: mCoordinates.lng,
          });
        } else {
          setReviews([]);
          setEmpty(true);
        }
      } else {
        setReviews(response);
      }
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

  return (
    <ExplorePage
      title={`Reviews in ${toTitleCase(
        decodeURIComponent(municipality).replaceAll("-", " ")
      )}, ${toTitleCase(decodeURIComponent(province))}`}
      loading={loading}
      reviews={reviews}
      coordinates={coordinates!}
      empty={empty}
    />
  );
}

{
  /* <MainLayout>
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
                  <OpenStreetMapMultiple reviews={reviews} zoom={12} />
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
              {!loading ? (
                <div className="flex justify-center items-center py-0 w-full h-full bg-gray-100 rounded-lg">
                  <OpenStreetMapMultiple reviews={reviews} zoom={14} />
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
    </MainLayout> */
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
