import CheckEmailImg from "public/images/check-email.png";
import Image from "next/image";
import Logo from "public/images/reviuLogo.svg";
import { locales } from "../../layout";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";

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
      ? "Check Email: Access Your Account"
      : locale == "es"
      ? "Check Email: Accede a tu cuenta"
      : "Check Email: Accedeix al teu compte";

  const description =
    locale == "en"
      ? "Log in to your Reviu account to access your dashboard, submit reviews, and manage your profile. Stay connected with the latest updates on rental homes in Barcelona."
      : locale == "es"
      ? "Inicia sesión en tu cuenta de Reviu para acceder a tu panel de control, enviar reseñas y opiniones y gestionar tu perfil. Mantente conectado con las últimas actualizaciones sobre viviendas de alquiler en Barcelona."
      : "Inicia sessió al teu compte de Reviu per accedir al teu tauler, enviar ressenyes i opinions i gestionar el teu perfil. Mantén-te connectat amb les últimes actualitzacions sobre habitatges de lloguer a Barcelona.";

  return {
    title: titleDetail,
    description,
  };
}

export default async function CheckEmail({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations();
  const tLinks = await getTranslations("linksTitles");

  return (
    <>
      <div className="flex flex-col justify-center gap-16 lg:gap-0 lg:flex-row h-screen lg:items-center bg-white">
        <div className="px-4 mt-28 w-full lg:w-7/12 lg:px-32 lg:mt-0 ">
          <div className="flex flex-col h-full justify-center lg:justify-start max-w-96 md:max-w-full ">
            <div>
              <h3>{t("loginForm.enlaceEnviado")}</h3>
              <p className="mt-5">
                {t("loginForm.revisaCorreo")}{" "}
                <span className=" underline">{t("loginForm.revisaSpam")}</span>{" "}
                {t("loginForm.cierraVentana")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-2 lg:flex-1 flex bg-[#FFFAE8] h-80 lg:h-full items-center justify-center relative lg:flex">
          <Image
            quality={100}
            src={CheckEmailImg}
            alt={"Check Email"}
            className="object-contain w-48 lg:w-[300px] h-auto"
            priority
          />
        </div>
        <div className="absolute top-8 left-8">
          <Link href={"/"} title={tLinks("/")}>
            <Image
              src={Logo}
              quality={100}
              alt="Home review"
              className="object-contain cursor-pointer h-auto"
              width={120}
            />
          </Link>
        </div>
      </div>
    </>
  );
}
