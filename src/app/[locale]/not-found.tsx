import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const t = useTranslations();

  return (
    <MainLayout>
      <div className="lg:px-16 px-8 pt-20 pb-40 bg-white  md:text-start ">
        <span className="text-[10px] leading-[14px] font-bold tracking-[1px] mb-2 uppercase">
          ERROR
        </span>
        <h3>{t("common.pageNotFound")}</h3>
      </div>
    </MainLayout>
  );
}
