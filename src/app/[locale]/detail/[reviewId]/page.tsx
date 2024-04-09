"use client";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ReviewDetail } from "@/components/organism/ReviewDetail";
import { Review, getReview } from "@/models/review";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BounceLoader } from "react-spinners";

export default function ReviewDetails({
  params,
}: {
  params: { reviewId: string };
}) {
  const router = useRouter();
  const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false);
  const t = useTranslations();

  const {
    data: review,
    isError,
    error,
  } = useQuery<Review | undefined, Error>({
    queryKey: ["building", params.reviewId],
    queryFn: () => getReview(params.reviewId),
  });

  if (isError) {
    console.error(error);
    router.push("/");
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
          <div className="flex justify-center mb-5">
            <h4 className="font-bold lg:block hidden ">
              {/* {t("common.detalleOpinion")}{" "} */}
              <span className="text-neutral-400">{review.address}</span>
            </h4>
          </div>
          <ReviewDetail
            review={review}
            openMoreInfo={openMoreInfo}
            setOpenMoreInfo={setOpenMoreInfo}
          />
        </div>
      </div>
    </MainLayout>
  );
}
