import { Space_Grotesk } from "next/font/google";
import "../../styles/globals.scss";
import { NextIntlClientProvider } from "next-intl";
import getRequestConfig from "../../i18n";
import { Providers } from "@/context";
import { Suspense } from "react";
import { unstable_setRequestLocale } from "next-intl/server";

const space_grotesk = Space_Grotesk({ subsets: ["latin"] });

// Can be imported from a shared config
const locales = ["es", "ca", "en"];

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
      ? "Reseñas de pisos real"
      : "Ressenyes de pisos reals";

  const description =
    locale == "en"
      ? "Share and find anonymous reviews about homes in your city. Access experiences of those who have already lived in the home you are looking for and share your own experiences about the places you have lived."
      : locale == "es"
      ? "Comparte y encuentra reseñas anónimas sobre pisos de tu ciudad. Infórmate de cómo es vivir en la casa que te interesa antes de mudarte y comparte opiniones sobre los lugares donde has vivido."
      : "Comparteix i troba ressenyes anònimes sobre pisos de la teva ciutat. Informa't de com és viure a la casa que t'interessa abans de mudar-t'hi i comparteix opinions sobre els llocs on has viscut.";
  return {
    title: "Reviu | " + titleDetail,
    description,
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
