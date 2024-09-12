import { MainLayout } from "@/components/layouts/MainLayout";
import { PrivacyPolicyComponent } from "@/components/sectionLegalPages/privacyPolicyComponent";
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
      ? "Privacy Policy: Understand How Your Information is Protected"
      : locale == "es"
      ? "Política de privacidad: Entiende cómo se protege tu información"
      : "Política de privacitat: Entén com es protegeix la teva informació";

  const description =
    locale == "en"
      ? "Read Reviu's privacy policy to understand how we collect, use, and protect your personal information. We are committed to ensuring your data privacy and security."
      : locale == "es"
      ? "Lee la política de privacidad de Reviu para entender cómo recopilamos, usamos y protegemos tu información personal. Nos comprometemos a garantizar la privacidad y seguridad de tus datos."
      : "Llegeix la política de privacitat de Reviu per entendre com recopilem, utilitzem i protegim la teva informació personal. Ens comprometem a garantir la privacitat i seguretat de les teves dades.";

  return {
    title: titleDetail,
    description,
  };
}

export default function PrivacyPolicy({
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
        <PrivacyPolicyComponent />
      </div>
    </MainLayout>
  );
}
