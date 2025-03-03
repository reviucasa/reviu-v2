import Image from "next/image";
import IconHouseLima from "../../../public/images/houseLima.svg";
import { getTranslations } from "next-intl/server";
import { HeaderAddressComboBox } from "../molecules/HeaderAddressComboBox";
import { HeaderAgencyComboBox } from "../molecules/HeaderAgencyComboBox";
import CardSlideClient from "../organism/CardSlideClient";
import { Link } from "@/navigation";

export type SectionType = {
  title: string;
  text: Array<string>;
  children: React.ReactNode;
  styleBorder: string;
  bg: string;
};

export type SectionsType = Array<SectionType>;

export async function SectionHeader() {
  const t = await getTranslations();
  const tLinks = await getTranslations("linksTitles");

  const tabSearchOpinion = t("slide.tabs.searchOpinion");
  const tabWriteOpinion = t("common.writeReview");
  const tabSearchAgency = t("slide.tabs.searchAgency");

  const dataContentSlide: SectionsType = [
    {
      title: tabSearchOpinion,
      text: [t("slide.titleSearchOpinion"), t("slide.titleWriteOpinion")],
      children: <HeaderAddressComboBox />,
      styleBorder: "border-b-secondary-500",
      bg: "bg-secondary-300",
    },
    {
      title: tabWriteOpinion,
      text: [t("slide.hazUnRepaso"), t("slide.noTeLlevesSorpresas")],
      children: (
        <Link className="btn btn-primary-500 content-center" href="/newReview" title={tLinks("/newReview")}>
          {t("common.writeReview")}
        </Link>
      ),
      styleBorder: "border-b-primary-500",
      bg: "bg-primary-100",
    },
    {
      title: tabSearchAgency,
      text: [t("slide.titleSearchOpinion"), t("slide.titleSearchAgency")],
      children: <HeaderAgencyComboBox />,
      styleBorder: "border-b-secondary-500",
      bg: "bg-secondary-300",
    },
  ];

  return (
    <div
      className={`w-full flex flex-col justify-center xl:h-[700px] rounded-[32px] overflow-visible`}
    >
      <div className="flex h-12 justify-center items-center gap-2 bg-black rounded-t-[32px]">
        <Image
          src={IconHouseLima}
          alt="icon house lima"
          className="hidden md:block h-3 w-3  md:h-5 md:w-5"
        />
        <span className="text-lime text-xs md:text-base">{t("common.reseñasYOpiniones")}</span>
      </div>
      <CardSlideClient dataContentSlide={dataContentSlide} />
    </div>
  );
}
