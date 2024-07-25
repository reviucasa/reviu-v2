import Image from "next/image";
import Instagram from "public/images/IconInstagram.svg";
import TikTok from "public/images/IconTikTok.svg";
import Twitter from "public/images/IconTwitter.svg";
import Idra from "public/images/IDRA-trans.png";
import LogoWhite from "public/images/reviuLogoWhite.svg";
import { DropDownLanguages } from "./DropDownLanguages";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";

export async function Footer() {
  const t = await getTranslations();
  const tLinks = await getTranslations("linksTitles");

  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-between w-full bg-black lg:px-44 lg:py-24 p-6 text-white">
        <div className="flex lg:flex-row gap-8 lg:justify-between flex-col lg:text-left text-center lg:mt-0 mt-8">
          <div className="lg:w-[280px]">
            <h4 className="font-extrabold text-base lg:text-2xl lg:block mb-4">
              {t("common.laComunidad")}
            </h4>
          </div>
          <div className="lg:text-left">
            <ul className="flex flex-col gap-4">
              <li className="text-purple-300 font-bold">
                {t("common.empresa")}
              </li>
              <li className="cursor-pointer">
                <Link href="/about" title={tLinks("/about")}>
                  {t("common.sobreNosotros")}
                </Link>
              </li>
              <li>info@reviucasa.com</li>
              {/* {t("common.contacto")} */}
            </ul>
          </div>
          <div className="lg:text-left">
            <ul className="flex flex-col gap-4">
              <li className="text-purple-300 font-bold">
                {t("common.recursos")}
              </li>
              {/*<li>{t('common.eresInmobiliaria', '¿Eres una inmobiliaria?')}</li>*/}
              {/*<li>{t('common.eresPropietario', '¿Eres propietario?')}</li>*/}
              <li className="cursor-pointer">
                <Link href="/blog" title={tLinks("/blog")}>
                  Blog
                </Link>
              </li>
              <li className="cursor-pointer">
                <Link href="/faqs" title={tLinks("/faqs")}>
                  {t("common.preguntasFecuentes")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="lg:text-left">
            <ul className="flex flex-col gap-4">
              <li className="text-purple-300 font-bold">{t("common.legal")}</li>
              <li className="cursor-pointer">
                <Link href="/privacyPolicy" title={tLinks("/privacyPolicy")}>
                  {t("common.politicaPrivacidad")}
                </Link>
              </li>
              <li className="cursor-pointer">
                <Link href="/legalNotice" title={tLinks("/legalNotice")}>
                  {t("common.legalNotice")}
                </Link>
              </li>
              <li className="cursor-pointer">
                <Link
                  href="/termsAndConditions"
                  title={tLinks("/termsAndConditions")}
                >
                  {t("common.terminosYCondiciones")}
                </Link>
              </li>
              <li className="cursor-pointer">
                <Link href="/cookies" title={tLinks("/cookies")}>
                  {t("common.cookies")}
                </Link>
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
                href=" https://www.instagram.com/reviu_casa"
                title={"Instagram - Reviu"}
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
                href="https://twitter.com/reviu_casa"
                title={"Twitter - Reviu"}
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
                title={"TikTok - Reviu"}
                href="https://www.tiktok.com/@reviu_casa"
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
      <div className="flex flex-col md:flex-row justify-between px-16 py-8 gap-6 md:gap-0 bg-white items-center">
        <p className="hidden md:block">2024 - © IDRA</p>
        <div className="flex flex-col md:flex-row justify-end gap-6">
          {/* <Image src={Nextgen} className="h-12 w-auto"   alt="icon next-gen" /> */}
          <Image src={Idra} className="h-10 w-auto mx-auto " alt="icon idra" />
        </div>
        <p className="md:hidden block">2024 - © IDRA</p>
      </div>
    </div>
  );
}
