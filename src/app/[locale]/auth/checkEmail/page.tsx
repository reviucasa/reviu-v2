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
      <div className="flex flex-col justify-center gap-16 lg:gap-0 lg:flex-row h-screen lg:items-center bg-white">
        <div className="px-4 mt-28 w-full lg:w-7/12 lg:px-32 lg:mt-0 ">
          <div className="flex flex-col h-full justify-center lg:justify-start max-w-96 md:max-w-full ">
            <div>
              <h3>{t("loginForm.enlaceEnviado")}</h3>
              <p className="mt-5">{t("loginForm.revisaCorreo")}</p>
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
