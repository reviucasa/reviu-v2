"use client";
import CheckEmailImg from "../../../../../public/check-email.png";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Logo from "../../../../../public/reviuLogo.svg";

export default function CheckEmail() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <>
      <div className="flex h-screen lg:items-center bg-white">
        <div className="px-4 mt-28 w-full lg:w-7/12 lg:px-32 lg:mt-0 ">
          <div className="flex flex-col h-full justify-between lg:justify-start">
            <div>
              <h3>{t("loginForm.enlaceEnviado")}</h3>
              <p className="mt-5">{t("loginForm.revisaCorreo")}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 hidden bg-[#FFFAE8] h-full items-center justify-center relative lg:flex">
          <Image
            quality={100}
            src={CheckEmailImg}
            alt={"Check Email"}
            width={300}
            className="object-contain h-auto"
            priority
          />
        </div>
        <div className="absolute top-8 left-8">
          <Image
            src={Logo}
            quality={100}
            alt="Home review"
            className="object-contain cursor-pointer h-auto"
            width={120}
            onClick={() => {
              router.push("/");
            }}
          />
        </div>
      </div>
    </>
  );
}
