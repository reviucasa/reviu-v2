import { Space_Grotesk } from "next/font/google";
import "../../styles/globals.scss";
import { NextIntlClientProvider } from "next-intl";
import getRequestConfig from "../../i18n";
import { Providers } from "@/context";
import { Suspense } from "react";
import { unstable_setRequestLocale } from "next-intl/server";
import { mainKeywords } from "@/staticData";
import { locales } from "@/config";

const space_grotesk = Space_Grotesk({ subsets: ["latin"] });

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
      ? "Home reviews you can trust"
      : locale == "es"
      ? "Reseñas de pisos reales"
      : "Ressenyes de pisos reals";

  const description =
    locale == "en"
      ? "Share and find anonymous reviews about homes in your city. Access experiences of those who have already lived in the home you are looking for and share your own experiences about the places you have lived."
      : locale == "es"
      ? "Comparte y encuentra reseñas y opiniones anónimas sobre pisos de tu ciudad. Infórmate de cómo es vivir en la casa que te interesa antes de mudarte y comparte opiniones sobre los lugares donde has vivido."
      : "Comparteix i troba ressenyes i opinions anònimes sobre pisos de la teva ciutat. Informa't de com és viure a la casa que t'interessa abans de mudar-t'hi i comparteix opinions sobre els llocs on has viscut.";

  const keywords = mainKeywords(locale);

  return {
    title: "Reviu | " + titleDetail,
    description,
    keywords,
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const { messages } = await getRequestConfig({ locale });

  return (
    <html lang={locale} className={space_grotesk.className}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Suspense>
            <Providers>{children}</Providers>
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
