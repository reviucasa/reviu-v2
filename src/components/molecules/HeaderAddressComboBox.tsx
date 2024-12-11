"use client";
import { findBuildingByAddress } from "@/models/building";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { useState } from "react";
import { AddressComboBox } from "../atoms/AddressComboBox";
import { FieldError } from "../atoms/FieldError";
import lupa from "public/images/lupa.png";
import { getCatastroDataFromAddress } from "@/helpers/catastroFunctions";
import { encodeForReadableURI } from "@/helpers/stringHelpers";

export function HeaderAddressComboBox({ className }: { className?: string }) {
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
      const res = await getCatastroDataFromAddress(address);
      if (res) {
        const ubi = res.response.bico
          ? res.response.bico?.localizacion.ubicacion
          : res.response.listaRegistroCatastral
          ? res.response.listaRegistroCatastral.registros[0].localizacion
              .ubicacion
          : null;

        const municipality = res.response.bico
          ? res.response.bico?.localizacion.municipio
          : res.response.listaRegistroCatastral
          ? res.response.listaRegistroCatastral.registros[0].localizacion
              .municipio
          : null;

        const province = res.response.bico
          ? res.response.bico?.localizacion.municipio
          : res.response.listaRegistroCatastral
          ? res.response.listaRegistroCatastral.registros[0].localizacion
              .provincia
          : null;

        console.log(
          res.response.bico
            ? res.response.bico.localizacion
            : res.response.listaRegistroCatastral
            ? res.response.listaRegistroCatastral.registros[0].localizacion
            : null
        );
        const err = res.response.errores;
        if (ubi && municipality && province) {
          const link = encodeForReadableURI(
            [
              province,
              municipality,
              ubi.direccion.siglas,
              ubi.direccion.nombre,
              ubi.direccion.numero,
            ].join("/")
          );
          router.push(`/building/${link}`);
        } else if (err) {
          console.log(err[0].desc, address);
          const num = res.response.numerero;
          if (num) {
            console.log(
              "Options: ",
              num.map((n) => n.numero)
            );
            setError(
              t("common.noSeEncontroDirección") +
                `. Options: ${num.map((n) => n.numero).toString()}`
            );
          } else {
            setError(err[0].desc);
          }
        } else {
          console.log("error fetching:", address);
        }
      } else {
        console.log("catastro data not found");
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
    <div className={className ? "" : "flex flex-col w-full items-center	"}>
      <AddressComboBox
        icon={lupa}
        placeholder={t("common.buscar")}
        className={className ?? "lg:w-3/4 w-full"}
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
