import Image from "next/image";
import cardBanner from "../../../public/cardbanner.png";
import { Button } from "../atoms/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export const BannerOpinion = ({
  className,
  text,
  textColor,
  textButton,
  colorButton = "btn-primary-500",
  bgCard = "bg-primary-100",
}: {
  className?: string;
  text?: string;
  textColor?: string;
  textButton?: string;
  colorButton?: string;
  bgCard?: string;
}) => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <div className={`grid rounded-lg overflow-hidden w-80 ${className}`}>
      <div
        className={`flex text-center justify-center items-center flex-col order-last pb-10 px-4 pt-8 ${bgCard} overflow-hidden`}
      >
        <h4 className={`${textColor} block mt-1`}>{text}</h4>
        <Button
          buttonClassName={`${colorButton}  mt-6 content-center overflow-hidden`}
          className="!w-full"
          onClick={
            () =>
              router.push(
                "/review"
              ) /* window.open("mailto:info@reviucasa.com") */
          }
        >
          {textButton}
        </Button>
      </div>
      <div className="relative min-h-[180px]">
        <Image src={cardBanner} fill alt="" className="object-cover" priority />
      </div>
    </div>
  );
};
