import { ImageRounded } from "@/components/atoms/ImageRounded";
import Image from "next/image";
import circulosection from "public/images/circulosection.svg";
import experiences from "public/images/experiences.png";
import sofa from "public/images/sofa.png";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

type SectionExperiencesProps = {
  className?: string;
};

export async function SectionExperiences({
  className,
}: SectionExperiencesProps) {
  const t = await getTranslations();

  return (
    <div className={className}>
      <div className="text-center">
        <div className="flex justify-center">
          <p className="flex self-center absolute text-xs font-bold leading-3 uppercase mb-0 text-primary-500">
            {t("experiences.howItWork")}
          </p>
          <Image src={circulosection} alt="" className="h-auto" width={152} />
        </div>
        <h2 className="flex pb-4 mt-6 xs:text-2xl">
          {t("experiences.shareAndFind")}
        </h2>
      </div>
      <div className="grid lg:grid-cols-2 justify-center gap-6 ">
        <ImageRounded image={sofa}>
          <h3 className="mt-7 text-center xs:text-xl">
            {t("experiences.shareExperiences")}
          </h3>
        </ImageRounded>
        <ImageRounded image={experiences}>
          <h3 className="mt-7 text-center xs:text-xl">
            {t("experiences.shareAndHelp")}
          </h3>
        </ImageRounded>
      </div>
    </div>
  );
}
