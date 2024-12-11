import MainLayout  from "@/components/layouts/MainLayout";
import { LegalNoticeComponent } from "@/components/sectionLegalPages/legalNoticeComponent";
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
      ? "Legal Notice: Important Information About Our Services"
      : locale == "es"
      ? "Aviso Legal: Información importante sobre nuestros servicios"
      : "Avís Legal: Informació important sobre els nostres serveis";

  const description =
    locale == "en"
      ? "Read the legal notice for Reviu to understand important information about our services, legal responsibilities, and user rights. Stay informed about the legal aspects of using our platform."
      : locale == "es"
      ? "Lee el aviso legal de Reviu para entender información importante sobre nuestros servicios, responsabilidades legales y derechos de los usuarios. Mantente informado sobre los aspectos legales de usar nuestra plataforma."
      : "Llegeix l'avís legal de Reviu per entendre informació important sobre els nostres serveis, responsabilitats legals i drets dels usuaris. Mantén-te informat sobre els aspectes legals d'utilitzar la nostra plataforma.";

  return {
    title: titleDetail,
    description,
  };
}

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
