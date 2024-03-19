import { MainLayout } from "@/components/layouts/MainLayout";
import { SectionFaq } from "@/components/sectionHome/sectionFaq";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Faq({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <MainLayout>
      <div className="mx-4 lg:mx-40 my-32 flex flex-col gap-28">
        <SectionFaq withTitle={false} />
      </div>
    </MainLayout>
  );
}
