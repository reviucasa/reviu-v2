"use client";
import { Address } from "@/models/types";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import debounce from "lodash.debounce";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import ReactLoading from "react-loading";
import lupa from "public/images/lupa.png";
import map from "public/images/maskGroup.png";
import { SelectAreaModal } from "./SelectAreaModal";
import NearbySearchButton from "./NearbySearchButton";
import { mainCitiesNeighbourhoods, provincesData } from "@/staticData";
import { toTitleCase } from "@/helpers/stringHelpers";

type AddressComboBoxProps = {
  placeholder?: string;
  className?: string;
  selectedAddress?: string;
  selectedAddressLoading?: boolean;
  setSelectedAddress?: (value: string) => void;
  areaOptions?: boolean;
};

interface MunicipalityResult {
  municipality?: string;
  province?: string;
}

interface NeighbourhoodResult {
  neighbourhood?: string;
  city?: string;
}

export const AddressComboBox = ({
  className,
  selectedAddress,
  setSelectedAddress,
  selectedAddressLoading,
  placeholder,
  areaOptions = true,
}: AddressComboBoxProps) => {
  const [searchResult, setSearchResult] = useState<{
    autocompleteSuggestions: Address[];
    status: string;
  }>({
    autocompleteSuggestions: [],
    status: "",
  });

  const [municipalitiesResults, setMunicipalitiesResults] = useState<
    {
      municipality?: string;
      province?: string;
    }[]
  >([]);

  const [neighbourhoodsResults, setNeighbourhoodsResults] = useState<
    {
      neighbourhood?: string;
      city?: string;
    }[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [queryLength, setQueryLength] = useState(0);
  const [showAreaOptions, setShowAreaOptions] = useState(true);
  const [isOpenSelectArea, setIsOpenSelectArea] = useState(false);

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
      const autocompleteSuggestions = predictions!.map((prediction) => {
        return {
          id: prediction.place_id,
          address: {
            string: prediction.description,
          },
        };
      }); // TODO: modificar per municipi
      /* .filter((e) => e.address.string.includes("Barcelona")) */

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

  const fetchMunicipalitiesList = useCallback((query: string) => {
    if (!query || query.length < 3) return;

    let matchedMunicipalities: MunicipalityResult[] = [];

    // Search municipalities in all provinces
    Object.entries(provincesData)
      .filter((v) =>
        ["BARCELONA", "LLEIDA", "TARRAGONA", "GIRONA"].includes(v[0])
      )
      .forEach(([province, municipalities]) => {
        const matchedMunicipalitiesForProvince = municipalities
          .filter((municipality) =>
            municipality.toLowerCase().includes(query.toLowerCase())
          )
          .map((municipality) => ({ municipality, province }));

        matchedMunicipalities = [
          ...matchedMunicipalities,
          ...matchedMunicipalitiesForProvince,
        ];
      });

    setMunicipalitiesResults(matchedMunicipalities);
  }, []);

  const fetchNeighbourhoodsList = useCallback((query: string) => {
    if (!query || query.length < 3) return;

    const removeDiacritics = (str: string) =>
      str
        .normalize("NFD") // Decomposes accents
        .replace(/[\u0300-\u036f]/g, "") // Removes diacritic marks
        .toLowerCase(); // Case insensitive

    const normalizedQuery = removeDiacritics(query);

    let matchedNeighbourhoods: NeighbourhoodResult[] = [];

    Object.entries(mainCitiesNeighbourhoods).forEach(
      ([city, neighbourhoods]) => {
        const matchedNeighbourhoodsForCity = neighbourhoods
          .filter((n) => removeDiacritics(n).includes(normalizedQuery))
          .map((neighbourhood) => ({ neighbourhood, city }));

        matchedNeighbourhoods = [
          ...matchedNeighbourhoods,
          ...matchedNeighbourhoodsForCity,
        ];
      }
    );

    setNeighbourhoodsResults(matchedNeighbourhoods);
  }, []);

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
      /* const bounds = {
        north: center.lat + 0.08,
        south: center.lat - 0.05,
        east: center.lng + 0.075,
        west: center.lng - 0.075,
      }; */

      const request: google.maps.places.AutocompletionRequest = {
        input: query,
        sessionToken: sessionToken,
        language: "ca",
        componentRestrictions: {
          country: "es",
        },
        //fields: ["name", "formatted_address"], //"address_components",
        types: ["address"],
        locationBias: "IP_BIAS",
        // locationRestriction: bounds,
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
    <Combobox immediate value={selectedAddress} onChange={setSelectedAddress}>
      <div className={`relative ${className}`}>
        <ComboboxInput
          id="query"
          className={`w-full !pl-10`}
          placeholder={placeholder ?? t("common.enQueDirección")}
          onChange={(event) => {
            setQueryLength(event.target.value.length);
            fetchAddressList(event.target.value);
            fetchNeighbourhoodsList(event.target.value);
            fetchMunicipalitiesList(event.target.value);
            if (event.target.value.length > 3) {
              setShowAreaOptions(false);
            } else {
              setShowAreaOptions(true);
            }
          }}
          autoComplete="off"
          onFocus={() => setShowAreaOptions(true)}
        />
        {!selectedAddressLoading && !loading && (
          <Image
            src={lupa}
            alt="lupa"
            className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
            aria-hidden="true"
          />
        )}
        {(selectedAddressLoading || loading) && (
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
          <ComboboxOptions className="absolute w-full mt-1 max-h-80 z-50 overflow-auto rounded-md bg-white p-1 border border-gray-300 ">
            {areaOptions && showAreaOptions && (
              <ComboboxOption
                className="cursor-pointer px-1 py-3 rounded-md hover:bg-secondary-300"
                key="area"
                value={undefined}
                onClick={() => {
                  return setIsOpenSelectArea(true);
                }}
              >
                <div className="flex flex-row space-x-2">
                  <Image
                    src={map}
                    alt="lupa"
                    className="h-5 w-auto text-gray-400  left-2.5 top-2.5"
                    aria-hidden="true"
                  />
                  <span>{t("common.searchByLocation")}</span>
                </div>
              </ComboboxOption>
            )}
            {areaOptions && showAreaOptions && <NearbySearchButton />}

            {loading && (
              <ComboboxOption
                className="cursor-pointer px-1 py-2 rounded-md hover:bg-secondary-300"
                key=""
                value={undefined}
                disabled
              >
                {t("common.buscandoDirección")}
              </ComboboxOption>
            )}
            {queryLength > 3 &&
              searchResult.autocompleteSuggestions.length === 0 &&
              !loading && (
                <ComboboxOption
                  className="cursor-pointer p-1 rounded-md hover:bg-secondary-300"
                  key=""
                  value={undefined}
                  disabled
                >
                  {t("common.noSeEncontroDirección")}
                </ComboboxOption>
              )}
            {neighbourhoodsResults.map((n, i) => {
              return (
                <ComboboxOption
                  className="cursor-pointer p-1 rounded-md hover:bg-secondary-300"
                  key={i}
                  value={`${n.neighbourhood} - ${n.city}`}
                >
                  <div className="flex flex-row w-full justify-between">
                    <div>{toTitleCase(`${n.neighbourhood} - ${n.city}`)}</div>
                    <div className="text-gray-400">Neighbourhood</div>
                  </div>
                </ComboboxOption>
              );
            })}
            {municipalitiesResults.map((m, i) => {
              return (
                <ComboboxOption
                  className="cursor-pointer p-1 rounded-md hover:bg-secondary-300"
                  key={i}
                  value={`${toTitleCase(m.municipality!)} - ${toTitleCase(
                    m.province!
                  )}`}
                >
                  <div className="flex flex-row w-full justify-between">
                    <div>
                      {toTitleCase(`${m.municipality} - ${m.province}`)}
                    </div>

                    <div className="text-gray-400">Municipality</div>
                  </div>
                </ComboboxOption>
              );
            })}
            {!loading && searchResult.autocompleteSuggestions.length > 0
              ? searchResult.autocompleteSuggestions.map((e) => {
                  return (
                    <ComboboxOption
                      className="cursor-pointer p-1 rounded-md hover:bg-secondary-300"
                      key={e.id}
                      value={e.address.string}
                    >
                      {e.address.string}
                    </ComboboxOption>
                  );
                })
              : null}
          </ComboboxOptions>
        </Transition>
      </div>
      <SelectAreaModal
        isOpen={isOpenSelectArea}
        setIsOpen={setIsOpenSelectArea}
      />
    </Combobox>
  );
};
