"use client";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Header } from "@/components/sectionAbout/header";
import { OurValues } from "@/components/sectionAbout/ourValues";
import { SectionCards } from "@/components/sectionAbout/sectionCards";
import { useTranslations } from "next-intl";

import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    document.body.className = "bg-white";
    return () => {
      document.body.className = "unset";
    };
  }, []);
  const t = useTranslations();

  return (
    <MainLayout>
      <div className="lg:py-[120px] lg:px-0 px-6 py-6 lg:pb-28 pb-16">
        <Header />
      </div>
      <div className="flex justify-center lg:mx-44 mx-4 lg:mb-[120px] mb-20">
        <SectionCards />
      </div>
      <div className="lg:mx-44 mx-4 mb-[120px] text-center">
        <h3 className="lg:text-[32px] lg:leading-10 text-xl leading-7">
          {t("about.somosMasQueUnPortal")}
        </h3>
      </div>
      <div className="mx-4 lg:mx-40 my-32 flex flex-col gap-28">
        <OurValues />
      </div>
    </MainLayout>
  );
}
