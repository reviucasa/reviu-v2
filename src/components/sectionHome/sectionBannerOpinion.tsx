"use client";
import Image from "next/image";
import opinion from "public/imgOpinion.svg";
import { Button } from "../atoms/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
export function SectionBannerOpinion() {
  const t = useTranslations();
  const router = useRouter();
  return (
    <div className="grid lg:grid-cols-2 rounded-[40px] overflow-hidden min-h-[388px]">
      <div className="text-center flex justify-center items-center lg:items-start flex-col lg:text-left lg:order-first order-last p-8 lg:py-20 lg:pl-[59px] lg:pr-[62px] bg-primary-100 overflow-hidden">
        <p className="text-xs text-primary-500 uppercase font-bold mb-1">
          {t("bannerOpinion.experienceAndShare")}
        </p>
        <h4 className="text-primary-500 lg:text-4xl lg:font-extrabold mt-1 xs:text-2xl">
          {t("bannerOpinion.helpIdeal")}
        </h4>
        <Button
          buttonClassName="btn-primary-500 mt-10 content-center overflow-hidden whitespace-nowrap"
          onClick={() => router.push("/review")}
        >
          {t("bannerOpinion.WriteOpinion")}
        </Button>
      </div>
      <div className="relative min-h-[180px]">
        <Image src={opinion} fill alt="" className="object-cover" />
      </div>
    </div>
  );
}
