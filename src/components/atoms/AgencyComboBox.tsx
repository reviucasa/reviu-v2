"use client";
import { RealStateAgency, searchAgenciesByName } from "@/models/agency";
import { Combobox, Transition } from "@headlessui/react";
import debounce from "lodash.debounce";
import { useTranslations } from "next-intl";
import Image, { StaticImageData } from "next/image";
import { Fragment, useCallback, useState } from "react";

type AddressComboBoxProps = {
  placeholder?: string;
  className?: string;
  selectedRealStateAgency?: RealStateAgency;
  icon?: StaticImageData;
  setSelectedRealStateAgency?: (value: RealStateAgency) => void;
};

export const AgencyComboBox = ({
  className,
  selectedRealStateAgency,
  setSelectedRealStateAgency,
  icon,
  placeholder,
}: AddressComboBoxProps) => {
  const [agenciesList, setAgenciesList] = useState<RealStateAgency[]>([]);
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchRealStateAgencyList = useCallback(
    debounce(async (query: string) => {
      setLoading(true);
      const agencies = await searchAgenciesByName(query.toLowerCase());
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
        <Combobox.Input
          className={`w-full ${icon && "!pl-10"}`}
          placeholder={placeholder ?? t("common.queInmobiliaria")}
          onChange={(event) =>
            event.target.value.length > 3
              ? fetchRealStateAgencyList(event.target.value)
              : {}
          }
          displayValue={(agency: any) => agency.name}
        />
        {icon && (
          <Image
            src={icon}
            alt="lupa"
            className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
            aria-hidden="true"
          ></Image>
        )}
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options className="absolute mt-1 max-h-40  w-full overflow-auto rounded-md bg-white p-1 border border-gray-300 z-50">
            {loading && (
              <Combobox.Option
                className="cursor-pointer p-1 rounded-md hover:bg-secondary-300"
                key=""
                value={undefined}
                disabled
              >
                {t("common.buscandoInmobiliaria")}
              </Combobox.Option>
            )}
            {agenciesList?.length === 0 && !loading && (
              <Combobox.Option
                className="cursor-pointer p-1 rounded-md hover:bg-secondary-300"
                key=""
                value={undefined}
                disabled
              >
                {t("common.noSeEncontroLaInmobiliaria")}
              </Combobox.Option>
            )}
            {!loading &&
              agenciesList?.slice(0, 3).map((agency) => (
                <Combobox.Option
                  className="cursor-pointer p-1 rounded-md hover:bg-secondary-300"
                  key={agency.id}
                  value={agency}
                >
                  {agency.name}
                </Combobox.Option>
              ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};
