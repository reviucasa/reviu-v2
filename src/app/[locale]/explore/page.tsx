import { mainKeywords } from "@/staticData";
import { locales } from "@/config";
import NearbyExplorePageClient from "./page.client";

export interface URLAddressParams {
  locale: string;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: {
    locale: string;
  };
}) {
  const titleDetail =
    locale === "en"
      ? `Reviu | Explore home reviews nearby`
      : locale === "es"
      ? `Reviu | Explora reseñas de viviendas cerca de ti`
      : `Reviu | Explora ressenyes d'habitatges aprop teu`;

  const description =
    locale === "en"
      ? `Learn more about home reviews near you. Read reviews and see detailed information about this area on Reviu.`
      : locale === "es"
      ? `Conoce más sobre reseñas de pisos cerca de ti. Lee reseñas y consulta información detallada sobre este área de alquiler en Reviu.`
      : `Coneix més sobre ressenyes de pisos aprop teu. Llegeix ressenyes i consulta informació detallada sobre aquesta àrea de lloguer a Reviu.`;

  const keywords = [...mainKeywords(locale, "").slice(0, 3)];

  return {
    title: titleDetail,
    description,
    keywords,
  };
}

export default function NearbyExplorePage({
  searchParams,
}: {
  searchParams: {
    locale?: string;
    lat?: string;
    lng?: string;
  };
}) {
  return <NearbyExplorePageClient searchParams={searchParams} />;
}
