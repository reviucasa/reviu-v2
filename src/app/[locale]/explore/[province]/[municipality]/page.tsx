import { mainKeywords } from "@/staticData";
import { locales } from "@/config";
import { decodeReadableURI, toTitleCase } from "@/helpers/stringHelpers";
import MunicipalityExplorePageClient from "./page.client";

export interface URLAddressParams {
  locale: string;
  elements: { province: string; municipality: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale, province, municipality },
}: {
  params: {
    locale: string;
    province: string;
    municipality: string;
  };
}) {
  const area = toTitleCase(
    decodeReadableURI([municipality, province].join(", "))
  );

  const titleDetail =
    locale == "en"
      ? `Reviu | Explore home reviews in ` // : ${building?.address + ", " + building?.postalCode}
      : locale == "es"
      ? `Reviu | Explora reseñas de viviendas en ` // : ${building?.address + ", " + building?.postalCode}
      : `Reviu | Explora ressenyes d'habitatges a `; // : ${building?.address + ", " + building?.postalCode}

  const title = titleDetail + area;

  const description =
    locale == "en"
      ? `Learn more about ${area}. Read reviews and see detailed information about this area on Reviu.`
      : locale == "es"
      ? `Conoce más sobre ${area}. Lee reseñas y consulta información detallada sobre este área de alquiler en Reviu.`
      : `Coneix més sobre ${area}. Llegeix ressenyes i consulta informació detallada sobre aquesta àrea de lloguer a Reviu.`;

  const keywords = [
    [province, municipality].join(" "),
    ...mainKeywords(locale, municipality).slice(0, 3),
  ];

  return {
    title,
    description,
    keywords,
  };
}

export default function MunicipalityExplorePage({
  params,
}: {
  params: {
    locale: string;
    province: string;
    municipality: string;
  };
}) {
  return <MunicipalityExplorePageClient params={params} />;
}
