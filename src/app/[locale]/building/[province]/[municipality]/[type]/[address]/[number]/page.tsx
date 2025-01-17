import { mainKeywords } from "@/staticData";
import { locales } from "@/config";
import { CatastroAddressElements } from "@/helpers/catastroFunctions";
import { decodeReadableURI, toTitleCase } from "@/helpers/stringHelpers";
import BuildingPageClient from "./page.client";

export interface URLAddressParams {
  locale: string;
  elements: CatastroAddressElements;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale, province, municipality, type, address, number, reviewId },
}: {
  params: {
    locale: string;
    province: string;
    municipality: string;
    type: string;
    address: string;
    number: string;
    reviewId: string;
  };
}) {
  const addr = toTitleCase(
    decodeReadableURI([[address, number].join(" "), municipality].join(", "))
  );


  const titleDetail =
    locale == "en"
      ? `Reviu | Reviews about ` // : ${building?.address + ", " + building?.postalCode}
      : locale == "es"
      ? `Reviu | Reseñas sobre ` // : ${building?.address + ", " + building?.postalCode}
      : `Reviu | Ressenyes sobre `; // : ${building?.address + ", " + building?.postalCode}

  const title = titleDetail + addr;

  const description =
    locale == "en"
      ? `Learn more about ${addr} ${number}, ${municipality}. Read reviews and see detailed information about this rental property on Reviu.`
      : locale == "es"
      ? `Conoce más sobre ${addr} ${number}, ${municipality}. Lee reseñas y consulta información detallada sobre esta propiedad de alquiler en Reviu.`
      : `Coneix més sobre ${addr} ${number}, ${municipality}. Llegeix ressenyes i consulta informació detallada sobre aquesta propietat de lloguer a Reviu.`;

  const keywords = [
    [addr, number, municipality].join(" "),
    ...mainKeywords(locale, municipality).slice(0, 3),
  ];

  return {
    title,
    description,
    keywords,
  };
}

export default function BuildingPage({
  params,
}: {
  params: {
    locale: string;
    province: string;
    municipality: string;
    type: string;
    address: string;
    number: string;
    reviewId: string;
  };
}) {
  return <BuildingPageClient params={params} />;
}
