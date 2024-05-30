import { MainLayout } from "@/components/layouts/MainLayout";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { locales } from "../layout";

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
      ? "Suspended: Your account has been suspended"
      : locale == "es"
      ? "Suspendido: Tu cuenta ha sido suspendida"
      : "Suspès: El teu compte ha estat suspès";

  const description =
    locale == "en"
      ? "our account has been temporarily suspended. Please contact support for more information and assistance in reactivating your account."
      : locale == "es"
      ? "Tu cuenta ha sido suspendida temporalmente. Por favor, contacta al soporte para más información y asistencia para reactivar tu cuenta."
      : "El teu compte ha estat suspès temporalment. Si us plau, contacta amb el suport per obtenir més informació i assistència per reactivar el teu compte.";
  return {
    title: titleDetail,
    description,
  };
}

export default async function SuspendedPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("suspended");
  return (
    <MainLayout>
      <div className="mx-4 lg:mx-40 my-32 flex flex-col gap-28">
        <div>
          <h2 className="mb-10">{t("title")}</h2>
          <div className="flex flex-col gap-3 mb-10">
            <h5 className="my-2 font-extrabold">{t("whySectionTitle")}</h5>
            <p>{t("whySectionStart")}</p>
            <ol className="ml-8 space-y-2" style={{ listStyleType: "circle" }}>
              <li>{t("whySection1")}</li>
              <li>{t("whySection2")}</li>
              <li>{t("whySection3")}</li>
              <li>{t("whySection4")}</li>
              <li>{t("whySection5")}</li>
              <li>{t("whySection6")}</li>
              <li>{t("whySection7")}</li>
              <li>{t("whySection8")}</li>
            </ol>

            <p>{t("whySectionEnd")}</p>
          </div>
          <div className="flex flex-col gap-3 mb-10">
            <h5 className="my-2 font-extrabold">{t("mistakeSectionTitle")}</h5>
            <p>
              {t("mistakeSection1")}{" "}
              <a
                href="mailto:info@reviucasa.com"
                className="text-blue-400 underline"
              >
                info@reviucasa.com
              </a>
              .
            </p>
            <p>{t("mistakeSection2")}</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
