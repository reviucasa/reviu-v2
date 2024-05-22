import Image from "next/image";
import IconHouseLima from "../../../public/images/houseLima.svg";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { HeaderAddressComboBox } from "../molecules/HeaderAddressComboBox";
import { HeaderAgencyComboBox } from "../molecules/HeaderAgencyComboBox";
import CardSlideClient from "../organism/CardSlideClient";

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
        <Link className="btn btn-primary-500 content-center" href="/review">
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

  const currentSection = dataContentSlide[0]; // Initial section for SSR

  return (
    <div
      className={`w-full flex flex-col justify-center xl:h-[700px] rounded-[32px] overflow-hidden mt-12`}
    >
      <div className="flex h-12 justify-center items-center gap-2 bg-black">
        <Image
          src={IconHouseLima}
          alt="icon house lima"
          className="h-4 w-4  lg:h-6 lg:w-6"
        />
        <span className="text-lime">{t("common.reseñasYOpiniones")}</span>
      </div>
      <h1 className="sr-only">{currentSection.text[0]}</h1>
      <CardSlideClient dataContentSlide={dataContentSlide} />
    </div>
  );
}
