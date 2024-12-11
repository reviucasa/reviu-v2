import MainLayout  from "@/components/layouts/MainLayout";
import { SectionExperiences } from "@/components/sectionHome/SectionExperiences";
import { SectionBanner } from "@/components/sectionHome/sectionBanner";
import { SectionBannerOpinion } from "@/components/sectionHome/sectionBannerOpinion";
import { SectionBlog } from "@/components/sectionHome/sectionBlog";
import { SectionFaq } from "@/components/sectionHome/sectionFaq";
import { SectionHeader } from "@/components/sectionHome/sectionHeader";
import { SectionLatestReviews } from "@/components/sectionHome/sectionLatestReviews";
import AuthCheck from "./AuthCheck";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <MainLayout className="flex flex-col gap-20">
      <AuthCheck />
      <div className="px-5 py-4 xl:py-8">
        <SectionHeader />
      </div>
      <div className="flex justify-center ">
        <SectionLatestReviews />
      </div>
      <div className="mx-4 lg:mx-40 flex flex-col">
        <SectionBlog />
      </div>
      <div className="flex justify-center">
        <SectionExperiences className="mx-12 lg:mx-0 w-[870px]" />
      </div>
      <SectionBanner />
      <div className="mx-4 lg:mx-40 my-16 pb-8 flex flex-col gap-20">
        <SectionBannerOpinion />
        <SectionFaq />
      </div>
    </MainLayout>
  );
}
