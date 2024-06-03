import Image from "next/image";
import okhand from "public/images/ok-hand.png";
import Link from "next/link";
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
      ? "Success: Your review has been submitted"
      : locale == "es"
      ? "Éxito: Tu reseña ha sido enviada"
      : "Èxit: La teva ressenya ha estat enviada";

  const description =
    locale == "en"
      ? "Thank you for submitting your review on Reviu. Your feedback helps others find reliable rental homes in Barcelona. Check your email for confirmation and further details."
      : locale == "es"
      ? "Gracias por enviar tu reseña en Reviu. Tu opinión ayuda a otros a encontrar viviendas de alquiler confiables en Barcelona. Revisa tu correo para la confirmación y más detalles."
      : "Gràcies per enviar la teva ressenya a Reviu. La teva opinió ajuda a altres a trobar habitatges de lloguer fiables a Barcelona. Revisa el teu correu per a la confirmació i més detalls.";

  return {
    title: titleDetail,
    description,
  };
}

export default async function Success({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations();
  const tLinks = await getTranslations("linksTitles");

  return (
    <div className="grid lg:px-14 lg:py-14 lg:grid-rows-1 lg:grid-cols-[3fr_6fr_3fr]">
      <div />
      <div className="text-center flex flex-col items-center gap-4 mt-6 p-8 lg:w-100 lg:bg-white lg:rounded-2xl lg:my-4">
        <Image
          quality={100}
          className="mb-7"
          src={okhand}
          alt="Ok hand"
          width={100}
          height={100}
        />
        <h3>{t("success.graciasDejarOpinion")}</h3>
        <p>
          {t("success.enBrevesSaldremos")}
          {"  "}
          {/* <span className="font-bold">{auth.currentUser?.email}</span> */}
        </p>
        <div className="flex gap-5">
          <Link
            className="btn btn-primary-500 mt-7 w-full lg:w-auto"
            href="/review"
            title={tLinks("/review")}
          >
            {t("success.publicarOtraOpinion")}
          </Link>
          <Link className="btn btn-terciary-500 mt-7 w-full lg:w-auto" href="/" title={tLinks("/")}>
            {t("success.menuPrincipal")}
          </Link>
        </div>
      </div>
      <div />
    </div>
  );
}
