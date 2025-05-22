import MainLayout from "@/components/layouts/MainLayout";
import { GoodPracticesComponent } from "@/components/sectionLegalPages/goodPracticesComponent";
import { locales } from "@/config";
import { setRequestLocale } from "next-intl/server";

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
      ? "Protocol of Good Practices of Reviu"
      : locale == "es"
      ? "Protocolo de Buenas Prácticas de Reviu"
      : "Protocol de Bones Pràctiques de Review";

  const description =
    locale == "en"
      ? "Read the Protocol of Good Practices on Reviu to learn the rules that ensure respectful and constructive participation in the platform. Understand how tenants, landlords, and agencies can share experiences while maintaining a positive community atmosphere."
      : locale == "es"
      ? "Lee el Protocolo de Buenas Prácticas en Reviu para conocer las normas que aseguran una participación respetuosa y constructiva en la plataforma. Entiende cómo los inquilinos, propietarios e inmobiliarias pueden compartir experiencias manteniendo un ambiente comunitario positivo."
      : "Llegeix el Protocol de Bones Pràctiques a Reviu per conèixer les normes que asseguren una participació respectuosa i constructiva a la plataforma. Entén com els inquilins, propietaris i immobiliàries poden compartir experiències mantenint un ambient comunitari positiu.";

  return {
    title: titleDetail,
    description,
  };
}

export default function GoodPracticesProtocol({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return (
    <MainLayout>
      <div className="mx-4 lg:mx-40 my-32 flex flex-col gap-28">
        <GoodPracticesComponent />
      </div>
    </MainLayout>
  );
}
