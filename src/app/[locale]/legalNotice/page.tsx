import { MainLayout } from "@/components/layouts/MainLayout";
import { LegalNoticeComponent } from "@/components/sectionLegalPages/legalNoticeComponent";
import { unstable_setRequestLocale } from "next-intl/server";

/* import { useEffect } from "react"; */

export default function LegalNotice({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  /* useEffect(() => {
    document.body.className = "bg-white";
    return () => {
      document.body.className = "unset";
    };
  }, []); */

  return (
    <MainLayout>
      <div className="mx-4 lg:mx-40 my-32 flex flex-col gap-28">
        <LegalNoticeComponent />
      </div>
    </MainLayout>
  );
}
