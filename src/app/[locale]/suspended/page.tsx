import { MainLayout } from "@/components/layouts/MainLayout";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

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
