import { MainLayout } from "@/components/layouts/MainLayout";
import { SectionFaq } from "@/components/sectionHome/sectionFaq";

export default function Faq() {
  return (
    <MainLayout>
      <div className="mx-4 lg:mx-40 my-32 flex flex-col gap-28">
        <SectionFaq withTitle={false} />
      </div>
    </MainLayout>
  );
}
