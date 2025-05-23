
import MyReviewsClientPage from "./page.client";
import { AccountLayout } from "@/components/layouts/AccountLayout";

export default async function MyReviewsPage() {


  return (
    <AccountLayout>
      <div className="lg:px-48 md:pt-20 md:px-20 bg-white p-6 pb-80">
        {/* <div className="relative grid lg:grid-cols-[1fr_auto] lg:gap-8 md:gap-4 grid-cols-1"> */}
        <MyReviewsClientPage />
        {/* <div className="w-auto hidden md:block">
            <BannerOpinion
              className="sticky top-10"
              text={t("common.quieresDejarOpinion")}
              textButton={t("common.escribeOpinion")}
              image={cardBannerImage}
            />
          </div> */}
      </div>
      {/* </div> */}
    </AccountLayout>
  );
}
