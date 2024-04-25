import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "../../styles/globals.scss";
import { NextIntlClientProvider, useMessages } from "next-intl";
import getRequestConfig from "../../i18n";
import { Providers } from "@/context";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

const space_grotesk = Space_Grotesk({ subsets: ["latin"] });

/* export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "ca" }, { locale: "en" }];
} */

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
  /* const t = await getTranslations({ locale, namespace: "Metadata" }); */
  return {
    title: "Reviu",
    description: "Comparteix i troba opinions anònimes sobre els pisos de la teva ciutat.",
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
