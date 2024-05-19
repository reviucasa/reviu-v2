"use client";

import { useState } from "react";
import { BounceLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { findBuildingByAddress } from "@/models/building";
import { RealStateAgency } from "@/models/agency";
import { SectionsType } from "./sectionHeader";
import { CardSlide } from "../organism/CardSlide";

type SectionHeaderClientProps = {
  dataContentSlide: SectionsType;
};

export default function SectionHeaderClient({
  dataContentSlide,
}: SectionHeaderClientProps) {
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [selectedRealStateAgency, setSelectedRealStateAgency] =
    useState<RealStateAgency>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const router = useRouter();

  const onSelectAddress = async (address: string) => {
    setError(undefined);
    setSelectedAddress(address);
    if (address && address !== "") {
      setLoading(true);
      const building = await findBuildingByAddress(address);
      if (building) {
        router.push(`/building/${building.id}`);
      } else {
        const addressRegex = /^(.*?),\s*(\d+)/;
        const match = address.match(addressRegex);
        if (!match) {
          setError("Missing street number");
        } else {
          setError("Address not found");
        }
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
      setError("Agency not found");
    }
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full z-50 bg-white opacity-90">
          <BounceLoader color="#d8b4fe" size={140} />
        </div>
      )}
      <CardSlide dataContentSlide={dataContentSlide} />
    </>
  );
}
