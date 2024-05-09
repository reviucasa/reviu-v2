"use client";
import Image from "next/image";
import Mano from "public/images/Frame.png";
import Banner from "public/images/imgBanner.png";
import { Button } from "../atoms/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function SectionBanner({ className }: { className?: string }) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className={`w-full h-full lg:h-96 relative ${className}`}>
      <Image src={Banner} alt="" fill className="object-cover" />
      <div className="grid lg:grid-cols-[60%_40%] h-full relative">
        <div className="h-full text-center flex justify-center items-center lg:items-start flex-col lg:text-left lg:ml-40 mb-4 lg:order-first order-last p-6">
          <h2 className="text-primary-500 xs:text-2xl">
            {t("banner.informationPower")}.
            <br /> {t("banner.changesRules")}
          </h2>
          <Button
            buttonClassName="btn-primary-500 mt-8 content-center"
            onClick={() => {
              router.push("/about");
            }}
          >
            {t("banner.knowus")}
          </Button>
        </div>
        <div className="grid content-center place-content-end p-6 pr-0 ">
          <div className="">
            <Image src={Mano} alt="" className="top-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
