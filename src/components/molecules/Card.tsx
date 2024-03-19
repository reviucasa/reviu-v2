import { useTranslations } from "next-intl";
import Image, { StaticImageData } from "next/image";

type SectionCardsProps = {
  className?: string;
  image?: StaticImageData;
  title?: string;
  text?: string;
  background?: string;
};

export function Card({
  className,
  image,
  title,
  text,
  background,
}: SectionCardsProps) {
  const t = useTranslations();

  return (
    <div
      className={`${className} ${background} flex flex-col justify-between min-w-[340px] min-h-[350px] rounded-[32px] p-8`}
    >
      {image && <Image src={image} alt="" className="object-cover" />}
      <div className="flex flex-col gap-4">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}
