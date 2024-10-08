"use client";
import Image, { StaticImageData } from "next/image";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

export const BannerOpinion = ({
  className,
  text,
  textColor,
  textClassName,
  textButton,
  colorButton = "btn-primary-500",
  bgCard = "bg-primary-100",
  image,
}: {
  className?: string;
  text?: string;
  textColor?: string;
  textClassName?: string;
  textButton?: string;
  colorButton?: string;
  bgCard?: string;
  image: StaticImageData;
}) => {
  const t = useTranslations();
  const tLinks = useTranslations("linksTitles");

  return (
    <div className={`grid rounded-lg overflow-hidden w-80 ${className}`}>
      <div
        className={`flex text-center justify-center items-center flex-col order-last pb-8 px-4 pt-8 ${bgCard} overflow-hidden`}
      >
        <h4 className={`${textColor} ${textClassName} block mt-1`}>{text}</h4>
        <Link
          className={`btn ${colorButton} mt-6 content-center overflow-hidden !w-full`}
          href={
            textButton == t("agency.contactaNosotros")
              ? "mailto:info@reviucasa.com"
              : "/newReview"
          }
          title={
            textButton == t("agency.contactaNosotros")
              ? "Email"
              : tLinks("/newReview")
          }
        >
          {textButton}
        </Link>
      </div>
      <div className="relative min-h-[180px]">
        <Image
          src={image}
          sizes="auto"
          fill
          alt=""
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};
