import { MainLayout } from "@/components/layouts/MainLayout";
import { ConditionsUseComponent } from "@/components/sectionLegalPages/conditionsUse";
import { LegalNoticeComponent } from "@/components/sectionLegalPages/legalNoticeComponent";

import { PrivacyPolicyComponent } from "@/components/sectionLegalPages/privacyPolicyComponent";
import { unstable_setRequestLocale } from "next-intl/server";

export default function LegalPages({
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
        <ConditionsUseComponent />
        <PrivacyPolicyComponent />
      </div>
    </MainLayout>
  );
}
