"use client";
import { MainLayout } from "@/components/layouts/MainLayout";
import { PrivacyPolicyComponent } from "@/components/sectionLegalPages/privacyPolicyComponent";
import { useEffect } from "react";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.body.className = "bg-white";
    return () => {
      document.body.className = "unset";
    };
  }, []);

  return (
    <MainLayout>
      <div className="mx-4 lg:mx-40 my-32 flex flex-col gap-28">
        <PrivacyPolicyComponent />
      </div>
    </MainLayout>
  );
}
