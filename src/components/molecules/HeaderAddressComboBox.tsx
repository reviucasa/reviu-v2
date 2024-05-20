"use client";
import { findBuildingByAddress } from "@/models/building";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddressComboBox } from "../atoms/AddressComboBox";
import { FieldError } from "../atoms/FieldError";
import lupa from "public/images/lupa.png";

export function HeaderAddressComboBox() {
  const t = useTranslations();
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const onSelectAddress = async (address: string) => {
    setError(undefined);
    setSelectedAddress(address);
    setLoading(true);
    if (address && address != "") {
      const building = await findBuildingByAddress(address);
      if (building) {
        router.push(`/building/${building.id}`);
      } else {
        const addressRegex = /^(.*?),\s*(\d+)/;
        const match = address.match(addressRegex);
        if (!match) {
          setError(t("common.missingStreetNumber"));
        } else {
          setError(t("common.noSeEncontroDirección"));
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full items-center	">
      <AddressComboBox
        icon={lupa}
        placeholder={t("common.buscar")}
        className="lg:w-3/4 w-full"
        selectedAddress={selectedAddress}
        selectedAddressLoading={loading}
        setSelectedAddress={onSelectAddress}
      />
      <div className="flex lg:w-3/4 w-full">
        <FieldError className=" my-3">{error}</FieldError>
      </div>
    </div>
  );
}
