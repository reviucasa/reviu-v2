"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { useState } from "react";
import { AddressComboBox } from "../atoms/AddressComboBox";
import { FieldError } from "../atoms/FieldError";
import { encodeForReadableURI } from "@/helpers/stringHelpers";
import { mainCitiesNeighbourhoods, provincesData } from "@/staticData";
import { getMunicipalityCoordinates } from "@/helpers/getMunicipalityCoordinates";
import { cleanAddress } from "@/helpers/addressFunctions";

export function HeaderAddressComboBox({ className }: { className?: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const onSelectAddress = async (address: string) => {
    setError(undefined);
    setSelectedAddress(address);
    if (address && address != "") {
      setLoading(true);
      if (address.includes(" - ")) {
        if (
          Object.keys(provincesData).includes(
            address.split(" - ")[1].toUpperCase()
          )
        ) {
          if (
            provincesData[address.split(" - ")[1].toUpperCase()].includes(
              address.split(" - ")[0].toUpperCase()
            )
          ) {
            router.push(
              `/explore/${address
                .split(" - ")
                .map((e) => encodeURIComponent(e))
                .join("/")
                .toLowerCase()}`
            );
            setLoading(false);

            return;
          }
        }

        if (
          Object.keys(mainCitiesNeighbourhoods).includes(
            address.split(" - ")[1]
          )
        ) {
          if (
            mainCitiesNeighbourhoods[address.split(" - ")[1]].includes(
              address.split(" - ")[0]
            )
          ) {
            const coordinates = await getMunicipalityCoordinates(
              address.split(" - ")[0],
              address.split(" - ")[1]
            );
            if (coordinates != null) {
              router.push(
                `/explore?lat=${coordinates?.lat}&lng=${
                  coordinates?.lng
                }&name=${encodeURIComponent(address)}`
              );
              setLoading(false);

              return;
            } else {
              console.log("Couldn't find neighbourhood", address);
              setLoading(false);

              return;
            }
            /* router.push(
            `/explore/${address.split(", ").join("/").toLowerCase()}`
          ); */
          }
        }
      }

      const addressRegex = /^(.*?),\s*(\d+)/;
      const match = address.match(addressRegex);
      if (!match) {
        setError(t("common.missingStreetNumber"));
      } else {
        try {
          if (!address) {
            throw "Error - No address";
          }

          const addr = cleanAddress(address, { forUri: true });

          const link = encodeForReadableURI(
            [
              addr?.province,
              addr?.municipality,
              addr?.type,
              addr?.street,
              addr?.number,
            ].join("/")
          );
          router.push(`/building/${link}`);
        } catch (e) {
          console.log(e);
          setError(t("common.noSeEncontroDirección"));
        }
      }
    } else {
      setError(t("common.noSeEncontroDirección"));
    }
    setLoading(false);
  };

  const setSelectedAddressForm = (s: string) => {
    const address = s.split("//")[1];

    onSelectAddress(address);
  };

  return (
    <div className={className ? "" : "flex flex-col w-full items-center	"}>
      <AddressComboBox
        placeholder={t("common.buscar")}
        className={className ?? "lg:w-3/4 w-full"}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddressForm}
        selectedAddressLoading={loading}
      />
      <div className="flex lg:w-3/4 w-full">
        <FieldError className=" my-3">{error}</FieldError>
      </div>
    </div>
  );
}
