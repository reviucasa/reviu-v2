import Image from "next/image";
import opinion from "public/images/imgOpinion.png";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function SectionBannerOpinion() {
  const t = await getTranslations();
  return (
    <div className="grid lg:grid-cols-2 rounded-[40px] overflow-hidden min-h-[388px]">
      <div className="text-center flex justify-center items-center lg:items-start flex-col lg:text-left lg:order-first order-last p-8 lg:py-20 lg:pl-[59px] lg:pr-[62px] bg-primary-100 overflow-hidden">
        <p className="text-xs text-primary-500 uppercase font-bold mb-1">
          {t("bannerOpinion.experienceAndShare")}
        </p>
        <h4 className="text-primary-500 lg:text-4xl lg:font-extrabold mt-1 xs:text-2xl">
          {t("bannerOpinion.helpIdeal")}
        </h4>
        <Link
          className="btn w-full btn-primary-500 mt-10 content-center overflow-hidden whitespace-nowrap"
          href="/review"
        >
          {t("bannerOpinion.WriteOpinion")}
        </Link>
      </div>
      <div className="relative min-h-[180px]">
        <Image src={opinion} fill alt="" className="object-cover" />
      </div>
    </div>
  );
}
