"use client";

import { MainLayout } from "@/components/layouts/MainLayout";
import { ConditionsUseComponent } from "@/components/sectionLegalPages/conditionsUse";
import { LegalNoticeComponent } from "@/components/sectionLegalPages/legalNoticeComponent";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import PrivacyPolicy from "../privacyPolicy/page";
import { PrivacyPolicyComponent } from "@/components/sectionLegalPages/privacyPolicyComponent";

export default function LegalPages() {
  useEffect(() => {
    document.body.className = "bg-white";
    return () => {
      document.body.className = "unset";
    };
  }, []);

  return (
    <MainLayout>
      <div className="mx-4 lg:mx-40 my-32 flex flex-col gap-28">
        <LegalNoticeComponent />
        <ConditionsUseComponent />
        <PrivacyPolicyComponent />
      </div>
    </MainLayout>
  );
}
