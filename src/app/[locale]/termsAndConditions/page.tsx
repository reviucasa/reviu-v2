"use client";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ConditionsUseComponent } from "@/components/sectionLegalPages/conditionsUse";

import { useEffect } from "react";

export default function TermsAndConditions() {
  useEffect(() => {
    document.body.className = "bg-white";
    return () => {
      document.body.className = "unset";
    };
  }, []);

  return (
    <MainLayout>
      <div className="mx-4 lg:mx-40 my-32 flex flex-col gap-28">
        <ConditionsUseComponent />
      </div>
    </MainLayout>
  );
}
