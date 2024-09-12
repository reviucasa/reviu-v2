import { MainLayout } from "@/components/layouts/MainLayout";
import { SectionFaq } from "@/components/sectionHome/sectionFaq";
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
      ? "FAQs: Frequently Asked Questions About Reviu"
      : locale == "es"
      ? "Preguntas Frecuentes: Preguntas comunes sobre Reviu"
      : "Preguntes Freqüents: Preguntes comuns sobre Reviu";

  const description =
    locale == "en"
      ? "Find answers to common questions about using Reviu, submitting reviews, and more. Our FAQs provide detailed information to help you make the most of our platform."
      : locale == "es"
      ? "Encuentra respuestas a preguntas comunes sobre el uso de Reviu, el envío de reseñas, opiniones y más. Nuestras preguntas frecuentes proporcionan información detallada para ayudarte a aprovechar al máximo nuestra plataforma."
      : "Troba respostes a preguntes comunes sobre l'ús de Reviu, l'enviament de ressenyes, opinions i més. Les nostres preguntes freqüents proporcionen informació detallada per ajudar-te a treure el màxim profit de la nostra plataforma.";

  return {
    title: titleDetail,
    description,
  };
}

export default function Faq({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <MainLayout>
      <div className="mx-4 lg:mx-40 my-32 flex flex-col gap-28">
        <SectionFaq withTitle={false} />
      </div>
    </MainLayout>
  );
}
