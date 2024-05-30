import { MainLayout } from "@/components/layouts/MainLayout";
import { ConditionsUseComponent } from "@/components/sectionLegalPages/conditionsUse";
import { unstable_setRequestLocale } from "next-intl/server";
import { locales } from "../layout";

/* import { useEffect } from "react"; */

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
      ? "Terms and conditions of Reviu: find your rental home in Barcelona"
      : locale == "es"
      ? "Términos y condiciones de Reviu: encuentra tu vivienda de alquiler en Barcelona"
      : "Termes i condicions de Reviu: troba el teu habitatge de lloguer a Barcelona";

  const description =
    locale == "en"
      ? "Read the terms and conditions of Reviu to understand how we help you find reliable rental homes in Barcelona. Discover detailed reviews and guides for a transparent and hassle-free rental experience."
      : locale == "es"
      ? "Lee los términos y condiciones de Reviu para entender cómo te ayudamos a encontrar viviendas de alquiler confiables en Barcelona. Descubre reseñas detalladas y guías para una experiencia de alquiler transparente y sin complicaciones."
      : "Llegeix els termes i condicions de Reviu per entendre com t'ajudem a trobar habitatges de lloguer fiables a Barcelona. Descobreix ressenyes detallades i guies per a una experiència de lloguer transparent i sense complicacions.";
  return {
    title: titleDetail,
    description,
  };
}

export default function TermsAndConditions({
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
        <ConditionsUseComponent />
      </div>
    </MainLayout>
  );
}
