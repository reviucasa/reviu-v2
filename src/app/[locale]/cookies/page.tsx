import { MainLayout } from "@/components/layouts/MainLayout";
import { CookiesComponent } from "@/components/sectionLegalPages/cookiesComponent";
import { unstable_setRequestLocale } from "next-intl/server";

/* import { useEffect } from "react"; */

export default function Cookies({
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
        <CookiesComponent />
      </div>
    </MainLayout>
  );
}
