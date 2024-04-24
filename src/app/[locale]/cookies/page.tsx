"use client";
import { MainLayout } from "@/components/layouts/MainLayout";
import { CookiesComponent } from "@/components/sectionLegalPages/cookiesComponent";

import { useEffect } from "react";

export default function Cookies() {
  useEffect(() => {
    document.body.className = "bg-white";
    return () => {
      document.body.className = "unset";
    };
  }, []);

  return (
    <MainLayout>
      <div className="mx-4 lg:mx-40 my-32 flex flex-col gap-28">
        <CookiesComponent />
      </div>
    </MainLayout>
  );
}
