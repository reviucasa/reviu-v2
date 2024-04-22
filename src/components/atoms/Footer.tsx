"use client";
import Image from "next/image";
import Link from "next/link";
import Instagram from "public/IconInstagram.svg";
import TikTok from "public/IconTikTok.svg";
import Twitter from "public/IconTwitter.svg";
import LogoWhite from "public/reviuLogoWhite.svg";
import { DropDownLanguages } from "./DropDownLanguages";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function Footer() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between w-full bg-black lg:px-44 lg:py-24 p-6 text-white">
      <div className="flex lg:flex-row gap-8 lg:justify-between flex-col lg:text-left text-center lg:mt-0 mt-8">
        <div className="lg:w-[280px]">
          <h4 className="font-extrabold text-base lg:text-2xl lg:block mb-4">
            {t("common.laComunidad")}
          </h4>
        </div>
        <div className="lg:text-left">
          <ul className="flex flex-col gap-4">
            <li className="text-purple-300 font-bold">{t("common.empresa")}</li>
            <li
              className="cursor-pointer"
              onClick={() => {
                router.push("/about");
              }}
            >
              {t("common.sobreNosotros")}
            </li>
            <li>{t("common.contacto")}</li>
          </ul>
        </div>
        <div className="lg:text-left">
          <ul className="flex flex-col gap-4">
            <li className="text-purple-300 font-bold">
              {t("common.recursos")}
            </li>
            {/*<li>{t('common.eresInmobiliaria', '¿Eres una inmobiliaria?')}</li>*/}
            {/*<li>{t('common.eresPropietario', '¿Eres propietario?')}</li>*/}
            <li
              onClick={() => {
                router.push("/blog");
              }}
              className="cursor-pointer"
            >
              Blog
            </li>
            <li
              onClick={() => {
                router.push("/faqs");
              }}
              className="cursor-pointer"
            >
              {t("common.preguntasFecuentes")}
            </li>
          </ul>
        </div>
        <div className="lg:text-left">
          <ul className="flex flex-col gap-4">
            <li className="text-purple-300 font-bold">{t("common.legal")}</li>
            <li
              className="cursor-pointer"
              onClick={() => {
                router.push("/privacyPolicy");
              }}
            >
              {t("common.politicaPrivacidad")}
            </li>
            <li
              className="cursor-pointer"
              onClick={() => {
                router.push("/legalNotice");
              }}
            >
              {t("common.legalNotice")}
            </li>
            <li
              className="cursor-pointer"
              onClick={() => {
                router.push("/termsAndConditions");
              }}
            >
              {t("common.terminosYCondiciones")}
            </li>
            <li
              className="cursor-pointer"
              onClick={() => {
                router.push("/cookies");
              }}
            >
              {t("common.cookies")}
            </li>
          </ul>
        </div>
      </div>
      <div className="flex lg:flex-row lg:justify-between flex-col items-center mt-12 ">
        <Image
          src={LogoWhite}
          alt="home review"
          className="grayscale h-auto"
          quality={100}
          width={120}
        />
        <div className="flex items-center lg:justify-between justify-evenly my-10 gap-3 xs:gap-5 xs:flex-col">
          <div className="flex gap-3">
            <Link
              href=" https://www.instagram.com/reviucasa"
              target="_blank"
              rel="no-follow noreferrer"
            >
              <div className="flex items-center justify-center bg-gray-600 rounded-full w-12 h-12">
                <Image
                  src={Instagram}
                  className="h-auto"
                  width={50}
                  alt="icon instagram"
                />
              </div>
            </Link>
            <Link
              href="https://twitter.com/reviucasa"
              target="_blank"
              rel="no-follow noreferrer"
            >
              <div className="flex items-center justify-center bg-gray-600 rounded-full w-12 h-12">
                <Image
                  src={Twitter}
                  className="h-auto"
                  width={50}
                  alt="icon twitter"
                />
              </div>
            </Link>
            <Link
              href="https://www.tiktok.com/@reviucasa"
              target="_blank"
              rel="no-follow noreferrer"
            >
              <div className="flex items-center justify-center bg-gray-600 rounded-full w-12 h-12">
                <Image
                  src={TikTok}
                  className="h-auto"
                  width={20}
                  alt="icono tiktok"
                />
              </div>
            </Link>
          </div>
          <DropDownLanguages />
        </div>
      </div>
    </div>
  );
}
