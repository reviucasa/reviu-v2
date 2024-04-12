"use client";

import { useState } from "react";
import { BounceLoader } from "react-spinners";
import lupa from "public/lupa.png";
import { AddressComboBox } from "../atoms/AddressComboBox";
import { Button } from "../atoms/Button";
import { FieldError } from "../atoms/FieldError";
import { CardSlide } from "../organism/CardSlide";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { findBuildingByAddress } from "@/models/building";
import { AgencyComboBox } from "../atoms/AgencyComboBox";
import { RealStateAgency } from "@/models/agency";

export type SectionType = {
  title: string;
  text: Array<string>;
  children: React.ReactNode;
  styleBorder: string;
  bg: string;
};

export type SectionsType = Array<SectionType>;

export function SectionHeader() {
  const t = useTranslations();
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [selectedRealStateAgency, setSelectedRealStateAgency] =
    useState<RealStateAgency>();
  const router = useRouter();
  const tabSearchOpinion = t("slide.tabs.searchOpinion");
  const tabWriteOpinion = t("common.writeReview");
  const tabSearchAgency = t("slide.tabs.searchAgency");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const onSelectAddress = async (address: string) => {
    setSelectedAddress(address);
    if (address && address != "") {
      setLoading(true);
      const building = await findBuildingByAddress(address);
      if (building) {
        router.push(`/building/${building.id}`);
      } else {
        setError(t("common.noSeEncontroDirección"));
      }
      setLoading(false);
    }
  };

  const onSelectRealStateAgency = async (agency: RealStateAgency) => {
    setSelectedRealStateAgency(agency);
    if (agency) {
      setLoading(true);
      router.push(`/agency/${agency.documentId}`);
    } else {
      setError(t("common.noSeEncontroLaInmobiliaria"));
    }
    setLoading(false);
  };

  const dataContentSlide: SectionsType = [
    {
      title: tabSearchOpinion,
      text: [t("slide.titleSearchOpinion"), t("slide.titleWriteOpinion")],
      children: (
        <div className="flex flex-col w-full items-center	">
          <AddressComboBox
            icon={lupa}
            placeholder={t("common.buscar")}
            className="lg:w-3/4 w-full"
            selectedAddress={selectedAddress}
            setSelectedAddress={onSelectAddress}
          />
          <div className="flex lg:w-3/4 w-full">
            <FieldError className=" my-3">{error}</FieldError>
          </div>
        </div>
      ),
      styleBorder: "border-b-secondary-500",
      bg: "bg-secondary-300",
    },
    {
      title: tabWriteOpinion,
      text: [t("slide.hazUnRepaso"), t("slide.noTeLlevesSorpresas")],
      children: (
        <Button
          buttonClassName="btn-primary-500 content-center"
          onClick={() => router.push("/review")}
        >
          {t("common.writeReview")}
        </Button>
      ),
      styleBorder: "border-b-primary-500",
      bg: "bg-primary-100",
    },
    {
      title: tabSearchAgency,
      text: [t("slide.titleSearchOpinion"), t("slide.titleSearchAgency")],
      children: (
        <div className="flex flex-col w-full items-center	">
          <AgencyComboBox
            icon={lupa}
            placeholder={t("common.searchAgency")}
            className="lg:w-3/4 w-full"
            selectedRealStateAgency={selectedRealStateAgency}
            setSelectedRealStateAgency={onSelectRealStateAgency}
          />
          <div className="flex lg:w-3/4 w-full">
            <FieldError className=" my-3">{error}</FieldError>
          </div>
        </div>
      ),
      styleBorder: "border-b-secondary-500",
      bg: "bg-secondary-300",
    },
  ];

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full z-50 bg-white opacity-90">
          <BounceLoader color="#d8b4fe" size={140} />
        </div>
      )}
      <div>
        <CardSlide dataContentSlide={dataContentSlide}></CardSlide>
      </div>
    </>
  );
}
