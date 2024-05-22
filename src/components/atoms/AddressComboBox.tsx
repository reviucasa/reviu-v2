"use client";
import { Address } from "@/models/types";
import { Combobox, Transition } from "@headlessui/react";
import debounce from "lodash.debounce";
import { useTranslations } from "next-intl";
import Image, { StaticImageData } from "next/image";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import ReactLoading from "react-loading";

type AddressComboBoxProps = {
  placeholder?: string;
  className?: string;
  selectedAddress?: string;
  icon?: StaticImageData;
  selectedAddressLoading?: boolean;
  setSelectedAddress?: (value: string) => void;
};

export const AddressComboBox = ({
  className,
  selectedAddress,
  setSelectedAddress,
  icon,
  selectedAddressLoading,
  placeholder,
}: AddressComboBoxProps) => {
  const [searchResult, setSearchResult] = useState<{
    autocompleteSuggestions: Address[];
    status: string;
  }>({
    autocompleteSuggestions: [],
    status: "",
  });

  const [loading, setLoading] = useState(false);

  // Initialize state for Google services to null
  const [service, setService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    // Load the Google Maps API only on the client side
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      version: "weekly",
      libraries: ["places"],
    });

    loader.importLibrary("places").then((places) => {
      setService(new places.AutocompleteService());
      setSessionToken(new places.AutocompleteSessionToken());
    });
  }, []);

  function handlePredictions(
    predictions: google.maps.places.QueryAutocompletePrediction[] | null,
    status: google.maps.places.PlacesServiceStatus
  ) {
    if (status === "OK") {
      // handle autocomplete suggestions
      const autocompleteSuggestions = predictions!
        .map((prediction) => {
          return {
            id: prediction.place_id,
            address: {
              string: prediction.description,
            },
          };
        })
        .filter((e) => e.address.string.includes("Barcelona"));
      setSearchResult({
        autocompleteSuggestions: autocompleteSuggestions,
        status: "OK",
      });
    } else {
      setSearchResult({
        autocompleteSuggestions: [],
        status: status,
      });
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchAddressList = useCallback(
    debounce(async (query: string) => {
      setLoading(true);

      if (query === "" || query.length < 2) {
        setSearchResult({
          autocompleteSuggestions: [],
          status: "",
        });
        setLoading(false);

        return;
      }

      if (!service || !sessionToken) return;

      // Create a bounding box with sides away from the center point
      const center = { lat: 41.40855, lng: 2.17114 };
      const bounds = {
        north: center.lat + 0.08,
        south: center.lat - 0.05,
        east: center.lng + 0.075,
        west: center.lng - 0.075,
      };

      const request: google.maps.places.AutocompletionRequest = {
        input: query,
        sessionToken: sessionToken,
        language: "ca",
        componentRestrictions: {
          country: "es",
        },
        //fields: ["name", "formatted_address"], //"address_components",
        types: ["address"],
        locationRestriction: bounds,
        //strictBounds: true,
      };

      // getQueryPredictions()
      service.getPlacePredictions(request, handlePredictions);

      setLoading(false);
    }, 300),
    [service, sessionToken]
  );

  const t = useTranslations();

  return (
    <Combobox value={selectedAddress} onChange={setSelectedAddress} nullable>
      <div className={`relative ${className}`}>
        <Combobox.Input
          id="query"
          className={`w-full ${icon && "!pl-10"}`}
          placeholder={placeholder ?? t("common.enQueDirección")}
          onChange={(event) => fetchAddressList(event.target.value)}
        />
        {icon && !selectedAddressLoading && (
          <Image
            src={icon}
            alt="lupa"
            className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
            aria-hidden="true"
          />
        )}
        {selectedAddressLoading && (
          <div className="opacity-90 absolute left-3 top-3.5">
            <ReactLoading type="spin" width={20} height={20} color="#9E80F7" />
          </div>
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
            {searchResult.autocompleteSuggestions.length === 0 && !loading && (
              <Combobox.Option
                className="cursor-pointer p-1 rounded-md hover:bg-secondary-300"
                key=""
                value={undefined}
                disabled
              >
                {t("common.noSeEncontroDirección")}
              </Combobox.Option>
            )}

            {
              !loading && searchResult.autocompleteSuggestions.length > 0
                ? searchResult.autocompleteSuggestions.map((e) => {
                    return (
                      <Combobox.Option
                        className="cursor-pointer p-1 rounded-md hover:bg-secondary-300"
                        key={e.id}
                        value={e.address.string}
                      >
                        {e.address.string}
                      </Combobox.Option>
                    );
                  })
                : null
              /* addressList.map((address) => (
                <Combobox.Option
                  className="cursor-pointer p-1 rounded-md hover:bg-secondary-300"
                  key={address.name.string}
                  value={address.name.string}
                >
                  {address.name.string}
                </Combobox.Option>
              )) */
            }
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};
