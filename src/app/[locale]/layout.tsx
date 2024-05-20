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
      ? "Share and find anonymous reviews about the homes in your city."
      : locale == "es"
      ? "Comparte y encuentra reseñas anónimas sobre los pisos de tu ciudad."
      : "Comparteix i troba ressenyes anònimes sobre els pisos de la teva ciutat.";
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
