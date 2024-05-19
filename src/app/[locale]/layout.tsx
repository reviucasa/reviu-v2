import { Space_Grotesk } from "next/font/google";
import "../../styles/globals.scss";
import { NextIntlClientProvider } from "next-intl";
import getRequestConfig from "../../i18n";
import { Providers } from "@/context";
import { Suspense } from "react";

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
  return {
    title: "Reviu",
    description:
      locale == "en"
        ? "Share and find anonymous opinions about the apartments in your city."
        : locale == "es"
        ? "Comparte y encuentra opiniones anónimas sobre los pisos de tu ciudad."
        : "Comparteix i troba opinions anònimes sobre els pisos de la teva ciutat.",
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
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
