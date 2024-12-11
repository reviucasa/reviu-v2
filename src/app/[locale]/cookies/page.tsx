import MainLayout  from "@/components/layouts/MainLayout";
import { CookiesComponent } from "@/components/sectionLegalPages/cookiesComponent";
import { locales } from "@/config";
import { unstable_setRequestLocale } from "next-intl/server";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const titleDetail =
    locale == "en"
      ? "Cookies Policy: How We Use Cookies on Reviu"
      : locale == "es"
      ? "Política de Cookies: Cómo usamos cookies en Reviu"
      : "Política de Cookies: Com utilitzem les cookies a Reviu";

  const description =
    locale == "en"
      ? "Learn about Reviu's cookies policy, including how we use cookies to enhance your experience, what types of cookies we use, and how you can manage your cookie preferences."
      : locale == "es"
      ? "Conoce la política de cookies de Reviu, incluyendo cómo usamos cookies para mejorar tu experiencia, qué tipos de cookies usamos y cómo puedes gestionar tus preferencias de cookies."
      : "Coneix la política de cookies de Reviu, incloent com usem cookies per millorar la teva experiència, quins tipus de cookies usem i com pots gestionar les teves preferències de cookies.";

  return {
    title: titleDetail,
    description,
  };
}

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
