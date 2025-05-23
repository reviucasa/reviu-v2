"use client";
import { toTitleCase } from "@/helpers/stringHelpers";
import { RealStateAgency, searchAgenciesByName } from "@/models/agency";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import debounce from "lodash.debounce";
import { useTranslations } from "next-intl";
import Image, { StaticImageData } from "next/image";
import { Fragment, useCallback, useState } from "react";
import ReactLoading from "react-loading";

type AddressComboBoxProps = {
  placeholder?: string;
  className?: string;
  selectedRealStateAgency?: RealStateAgency;
  selectedAgencyLoading?: boolean;
  icon?: StaticImageData;
  setSelectedRealStateAgency?: (value: RealStateAgency) => void;
};

export const AgencyComboBox = ({
  className,
  selectedRealStateAgency,
  setSelectedRealStateAgency,
  icon,
  selectedAgencyLoading,
  placeholder,
}: AddressComboBoxProps) => {
  const [agenciesList, setAgenciesList] = useState<RealStateAgency[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRealStateAgencyList = useCallback(
    debounce(async (query: string) => {
      setLoading(true);

      if (query === "") {
        setAgenciesList([]);
        setLoading(false);

        return;
      }

      const agencies = await searchAgenciesByName(query);
      setAgenciesList(agencies);
      setLoading(false);
    }, 300),
    []
  );

  const t = useTranslations();

  return (
    <Combobox
      value={selectedRealStateAgency}
      onChange={setSelectedRealStateAgency}
    >
      <div className={`relative ${className}`}>
        <ComboboxInput
          className={`w-full ${icon && "!pl-10"}`}
          placeholder={placeholder ?? t("common.queInmobiliaria")}
          onChange={(event) =>
            event.target.value.length > 3
              ? fetchRealStateAgencyList(event.target.value)
              : {}
          }
          displayValue={(agency: any) => (agency != null ? agency.name : "")}
        />
        {icon && !selectedAgencyLoading && (
          <Image
            src={icon}
            alt="lupa"
            className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
            aria-hidden="true"
          />
        )}

        {selectedAgencyLoading && (
          <div className="opacity-90 absolute left-3 top-3.5">
            <ReactLoading type="spin" width={20} height={20} color="#124A36" />
          </div>
        )}
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ComboboxOptions className="absolute mt-1 max-h-80  w-full overflow-auto rounded-md bg-white p-1 border border-gray-300 z-50">
            {loading && (
              <ComboboxOption
                className="cursor-pointer p-1 rounded-md hover:bg-secondary-300"
                key=""
                value={undefined}
                disabled
              >
                {t("common.buscandoInmobiliaria")}
              </ComboboxOption>
            )}
            {agenciesList?.length === 0 && !loading && (
              <ComboboxOption
                className="cursor-pointer p-1 rounded-md hover:bg-secondary-300"
                key=""
                value={undefined}
                disabled
              >
                {t("common.noSeEncontroLaInmobiliaria")}
              </ComboboxOption>
            )}
            {!loading &&
              agenciesList?.map((agency) => (
                <ComboboxOption
                  className="cursor-pointer p-1 rounded-md hover:bg-secondary-300"
                  key={agency.id}
                  value={agency}
                >
                  <div className="flex flex-row w-full justify-between">
                    <div>{toTitleCase(`${agency.name}`)}</div>

                    <div className="text-gray-400">{agency.address}</div>
                  </div>
                </ComboboxOption>
              ))}
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  );
};
