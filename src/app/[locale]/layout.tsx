import { Space_Grotesk } from "next/font/google";
import "../../styles/globals.scss";
import { NextIntlClientProvider } from "next-intl";
import getRequestConfig from "../../i18n";
import { Providers } from "@/context";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { mainKeywords } from "@/staticData";
import { locales } from "@/config";
import Script from "next/script";

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

  const keywords = mainKeywords(locale, "");

  return {
    title: "Reviu | " + titleDetail,
    description,
    keywords,
    openGraph: {
      title: titleDetail,
      description,
      url: `https://www.reviucasa.com`,
      siteName: "Reviu",
      locale: locale,
      type: "website",
      images: [
        {
          url: "https://www.reviucasa.com/images/home-opengraph-image.png",
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    twitter: {
      title: titleDetail,
      description,
      card: "summary_large_image",
      images: ["https://www.reviucasa.com/images/home-opengraph-image.png"],
    },
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  // FIXME: Both locale and requestLocale are now mandatory, but locale should be removed at some point
  const { messages } = await getRequestConfig({
    locale,
    requestLocale: new Promise((resolve) => resolve(locale)),
  });

  return (
    <html lang={locale} className={space_grotesk.className}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Suspense>
            <Providers>{children}</Providers>
          </Suspense>
        </NextIntlClientProvider>
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '8214296315332591');
          fbq('track', 'PageView');
        `}
        </Script>
      </body>
    </html>
  );
}
