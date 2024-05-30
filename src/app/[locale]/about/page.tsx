import { MainLayout } from "@/components/layouts/MainLayout";
import { Header } from "@/components/sectionAbout/header";
import { OurValues } from "@/components/sectionAbout/ourValues";
import { Partners } from "@/components/sectionAbout/partners";
import { SectionCards } from "@/components/sectionAbout/sectionCards";
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
      ? "About Reviu: Your Trusted Rental Home Reviews"
      : locale == "es"
      ? "Sobre Reviu: Tus reseñas de viviendas de alquiler de confianza"
      : "Sobre Reviu: Les teves ressenyes de lloguer de confiança";

  const description =
    locale == "en"
      ? "Learn about Reviu, the platform dedicated to providing trusted reviews of rental homes in Barcelona. Discover how we help you find the best rental properties."
      : locale == "es"
      ? "Conoce Reviu, la plataforma dedicada a proporcionar reseñas confiables de viviendas de alquiler en Barcelona. Descubre cómo te ayudamos a encontrar las mejores propiedades de alquiler."
      : "Coneix Reviu, la plataforma dedicada a proporcionar ressenyes fiables d'habitatges de lloguer a Barcelona. Descobreix com t'ajudem a trobar les millors propietats de lloguer.";

  return {
    title: titleDetail,
    description,
  };
}

export default async function About({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <MainLayout>
      <div className="lg:py-[120px] lg:px-0 px-6 py-6 lg:pb-28 pb-16">
        <Header />
      </div>
      <div className="flex justify-center lg:mx-44 mx-4 lg:mb-[120px] mb-20">
        <SectionCards />
      </div>
      <div className="lg:mx-44 mx-4 mb-[120px] text-center">
        <h3 className="lg:text-[32px] lg:leading-10 text-xl leading-7">
          {t("about.somosMasQueUnPortal")}
        </h3>
      </div>
      <div className="mx-4 lg:mx-40 my-32 flex flex-col gap-28">
        <OurValues />
      </div>
      <div className=" py-12 flex flex-col bg-white">
        <Partners />
      </div>
    </MainLayout>
  );
}
