"use client";
import { MainLayout } from "@/components/layouts/MainLayout";
import { LegalNoticeComponent } from "@/components/sectionLegalPages/legalNoticeComponent";

import { useEffect } from "react";

export default function LegalNotice() {
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
      </div>
    </MainLayout>
  );
}
