"use client";
import { MainLayout } from "@/components/layouts/MainLayout";
import { SectionExperiences } from "@/components/sectionHome/SectionExperiences";
import { SectionBanner } from "@/components/sectionHome/sectionBanner";
import { SectionBannerOpinion } from "@/components/sectionHome/sectionBannerOpinion";
import { SectionFaq } from "@/components/sectionHome/sectionFaq";
import { SectionHeader } from "@/components/sectionHome/sectionHeader";
import { SectionLatestReviews } from "@/components/sectionHome/sectionLatestReviews";
import { useAuth } from "@/context/auth";
import { verifyEmailLinkAndAuthenticate } from "@/firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const handleVerify = async () => {
    const credentials = await verifyEmailLinkAndAuthenticate();
    if (credentials && credentials.user.displayName === null) {
      router.replace("/auth/register");
    }
  };

  useEffect(() => {
    handleVerify();
  }, []);

  return (
    <MainLayout>
      <div className="px-5 pb-28">
        <SectionHeader />
      </div>
      <div className="flex justify-center">
        <SectionLatestReviews />
      </div>
      <div className="flex justify-center">
        <SectionExperiences className="mx-12 lg:mx-0 mb-32 w-[870px]" />
      </div>
      <SectionBanner />
      <div className="mx-4 lg:mx-40 my-32 flex flex-col gap-28">
        <SectionBannerOpinion />
        <SectionFaq />
      </div>
    </MainLayout>
  );
}

/* 

*/
