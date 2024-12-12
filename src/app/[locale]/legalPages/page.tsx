import MainLayout  from "@/components/layouts/MainLayout";
import { ConditionsUseComponent } from "@/components/sectionLegalPages/conditionsUse";
import { LegalNoticeComponent } from "@/components/sectionLegalPages/legalNoticeComponent";

import { PrivacyPolicyComponent } from "@/components/sectionLegalPages/privacyPolicyComponent";
import { locales } from "@/config";
import { setRequestLocale } from "next-intl/server";

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
      ? "Legal Pages: Legal Notice, Conditions of Use, and Privacy Policy"
      : locale == "es"
      ? "Páginas legales: Aviso legal, condiciones de uso y política de privacidad"
      : "Pàgines legals: Avís legal, condicions d'ús i política de privacitat";

  const description =
    locale == "en"
      ? "Access Reviu's legal pages to read our legal notice, conditions of use, and privacy policy. Understand the terms and conditions that apply when using our platform and how we protect your data."
      : locale == "es"
      ? "Accede a las páginas legales de Reviu para leer nuestro aviso legal, condiciones de uso y política de privacidad. Entiende los términos y condiciones que se aplican al usar nuestra plataforma y cómo protegemos tus datos."
      : "Accedeix a les pàgines legals de Reviu per llegir el nostre avís legal, condicions d'ús i política de privacitat. Entén els termes i condicions que s'apliquen quan utilitzes la nostra plataforma i com protegim les teves dades.";

  return {
    title: titleDetail,
    description,
  };
}

export default function LegalPages({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
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
