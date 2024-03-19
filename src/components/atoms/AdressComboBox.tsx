import { Adress } from "@/models/types";
import { Combobox, Transition } from "@headlessui/react";
import debounce from "lodash.debounce";
import { useTranslations } from "next-intl";
import Image, { StaticImageData } from "next/image";
import { Fragment, useCallback, useState } from "react";

type AdressComboBoxProps = {
  placeholder?: string;
  className?: string;
  selectedAdress?: string;
  icon?: StaticImageData;
  setSelectedAdress?: (value: string) => void;
};

export const AdressComboBox = ({
  className,
  selectedAdress,
  setSelectedAdress,
  icon,
  placeholder,
}: AdressComboBoxProps) => {
  const [adressList, setAdressList] = useState<Adress[]>([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchAdressList = useCallback(
    debounce(async (query: string) => {
      setLoading(true);
      /* const response = await getAddressList(query)
      setAdressList(response.data.results) */
      setLoading(false);
    }, 300),
    []
  );
  const t = useTranslations();

  return (
    <Combobox value={selectedAdress} onChange={setSelectedAdress}>
      <div className={`relative ${className}`}>
        <Combobox.Input
          className={`w-full ${icon && "!pl-10"}`}
          placeholder={placeholder ?? t("common.enQueDirección")}
          onChange={(event) => fetchAdressList(event.target.value)}
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
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white p-1 border border-gray-300 z-10">
            {loading && (
              <Combobox.Option
                className="cursor-pointer p-1 rounded-md hover:bg-secondary-300"
                key=""
                value={undefined}
                disabled
              >
                {t("common.buscandoDirección")}
              </Combobox.Option>
            )}
            {adressList.length === 0 && !loading && (
              <Combobox.Option
                className="cursor-pointer p-1 rounded-md hover:bg-secondary-300"
                key=""
                value={undefined}
                disabled
              >
                {t("common.noSeEncontroDirección")}
              </Combobox.Option>
            )}
            {!loading &&
              adressList.map((adress) => (
                <Combobox.Option
                  className="cursor-pointer p-1 rounded-md hover:bg-secondary-300"
                  key={adress.address}
                  value={adress.address}
                >
                  {adress.address}
                </Combobox.Option>
              ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};
