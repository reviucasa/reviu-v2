import { MainLayout } from "@/components/layouts/MainLayout";
import { ReviewDetail } from "@/components/organism/ReviewDetail";
import { getReview } from "@/models/review";
import { BounceLoader } from "react-spinners";

export default async function ReviewDetails({
  params,
}: {
  params: { reviewId: string };
}) {
  const review = await getReview(params.reviewId);

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
              <span className="">{review.address}</span>
            </h4>
          </div>
          <ReviewDetail
            review={review}
          />
        </div>
      </div>
    </MainLayout>
  );
}
