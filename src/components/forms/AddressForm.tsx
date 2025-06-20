"use client";
import { Button } from "@/components/atoms/Button";
import { FieldError } from "@/components/atoms/FieldError";
import { AcceptDialog } from "@/components/dialogs/AcceptDialog";
import { ReviewFormLayout } from "@/components/layouts/ReviewFormLayout";
import Message from "public/images/message.png";
import HappyHouse from "public/images/happyHouse.png";
import { useCallback, useEffect, useState } from "react";
import { AddressComboBox } from "../atoms/AddressComboBox";
import { Dialog } from "../atoms/Dialog";
import { useRouter, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import {
  getNextStepReview,
  getPositionUrlReview,
  getUrlReview,
} from "@/helpers/stepper";
import {
  createDraft,
  getReviewsFromUser,
  ReviewStatus,
  updateDraft,
} from "@/models/review";
import { auth } from "@/firebase/config";
import { useDraft } from "@/hooks/swr/useDraft";
import { removeLocaleFromPath } from "../atoms/DropDownLanguages";

import { replaceUndefinedWithNull } from "@/helpers/replaceUndefinedWithNull";
import { Building, Apartment, Location, Coordinates } from "@/models/building";
import { Timestamp } from "firebase/firestore";

export const AddressForm = () => {
  const { draft, refreshDraft } = useDraft();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const t = useTranslations();

  const AddressNotFoundHelp = ({
    className,
    onClick,
  }: {
    className?: string;
    onClick: () => void;
  }) => (
    <div className={className}>
      <span>{t("addressReview.noEncuentrasDireccion")}</span>{" "}
      <a
        className="text-primary-500 font-bold cursor-pointer"
        onClick={onClick}
      >
        {t("addressReview.ayuda")}
      </a>
    </div>
  );
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [building, setBuilding] = useState<Building>();
  const [placeId, setPlaceId] = useState<string>();

  const [error, setError] = useState<string>();

  const [apartment, setApartment] = useState<Apartment>({
    door: "",
    floor: "",
    stair: "",
  });

  const [isOpenReviewAuthenticityAlert, setIsOpenReviewAuthenticityAlert] =
    useState(false);
  const [isOpenExistingReviewAlert, setIsOpenExistingReviewAlert] =
    useState(false);
  const [isOpenExistingTwoReviewsAlert, setIsOpenExistingTwoReviewsAlert] =
    useState(false);
  const [isOpenAddressIncorrectAlert, setIsOpenAddressIncorrectAlert] =
    useState(false);

  useEffect(() => {
    const fetchBuilding = async (placeId: string) => {
      const { Place } = (await google.maps.importLibrary(
        "places"
      )) as google.maps.PlacesLibrary;

      // Use place ID to create a new Place instance.
      const place = new Place({
        id: placeId,
        requestedLanguage: "ca",
      });

      // Call fetchFields, passing the desired data fields.
      await place.fetchFields({
        fields: [
          "displayName",
          "formattedAddress",
          "location",
          "addressComponents",
        ],
      });

      let district = "";
      let municipality = place.addressComponents![2].longText ?? "";
      let province = place.addressComponents![3].longText ?? "";
      let postalCode = place.addressComponents![6].longText ?? "";

      if (
        ["Barcelona", "Madrid", "Valencia"].includes(
          place.addressComponents![3].longText!
        )
      ) {
        district = place.addressComponents![2].longText ?? "";
        municipality = place.addressComponents![3].longText ?? "";
        province = place.addressComponents![4].longText ?? "";
        postalCode = place.addressComponents![7].longText ?? "";
      }

      const location: Location = {
        coordinates: {
          latitude: place.location?.lat(),
          longitude: place.location?.lng(),
        } as Coordinates,
        municipality,
        number: parseInt(place.addressComponents![0].longText ?? "0"),
        district,
        province,
        street: place.addressComponents![1].longText ?? "",
        type: "",
      };

      const building: Building = {
        address: place.formattedAddress!,
        location,
        postalCode,
      };


      setBuilding(building);
    };

    const acceptedTerms = localStorage.getItem("acceptedReviewTerms");

    // Check if the terms have not been accepted yet
    if (acceptedTerms == null) {
      setIsOpenReviewAuthenticityAlert(true);
    }

    if (draft?.address) {
      setPlaceId(draft.placeId);
      setSelectedAddress(draft.address);

      if (draft?.apartment) {
        setApartment(draft.apartment);
      }

      fetchBuilding(draft.placeId);
    }
  }, [draft]);

  const onSelectAddress = useCallback(async () => {
    setBuilding(undefined);
    /* if (draft?.address != selectedAddress) {
      setApartment({
        door: "",
        floor: "",
        stair: "",
      });
    } */
    setError(undefined);


    const addressRegex = /^(.*?),\s*(\d+)/;
    const match = selectedAddress.match(addressRegex);
    if (!match) {
      setError(t("common.missingStreetNumber"));
    } else {
      try {
        if (!placeId) {
          throw "Error - No placeId";
        }
        if (!selectedAddress) {
          throw "Error - No address";
        }
        const { Place } = (await google.maps.importLibrary(
          "places"
        )) as google.maps.PlacesLibrary;

        // Use place ID to create a new Place instance.
        const place = new Place({
          id: placeId,
          requestedLanguage: "ca",
        });

        // Call fetchFields, passing the desired data fields.
        await place.fetchFields({
          fields: [
            "displayName",
            "formattedAddress",
            "location",
            "addressComponents",
          ],
        });

        let district = "";
        let municipality = place.addressComponents![2].longText ?? "";
        let province = place.addressComponents![3].longText ?? "";
        let postalCode = place.addressComponents![6].longText ?? "";

        if (
          ["Barcelona", "Madrid", "Valencia"].includes(
            place.addressComponents![3].longText!
          )
        ) {
          district = place.addressComponents![2].longText ?? "";
          municipality = place.addressComponents![3].longText ?? "";
          province = place.addressComponents![4].longText ?? "";
          postalCode = place.addressComponents![7].longText ?? "";
        }

        const location: Location = {
          coordinates: {
            latitude: place.location?.lat(),
            longitude: place.location?.lng(),
          } as Coordinates,
          district,
          municipality,
          number: parseInt(place.addressComponents![0].longText ?? "0"),
          province,
          street: place.addressComponents![1].longText ?? "",
          type: "",
        };
        // const postalCode = place.address_components;

        const building: Building = {
          address: place.formattedAddress!,
          location,
          postalCode,
        };

        setBuilding(building);
      } catch (e) {
        console.log(e);
        setError(t("common.noSeEncontroDirección"));
      }
    }
  }, [selectedAddress, t]);

  const currentUrlPosition = getPositionUrlReview(
    removeLocaleFromPath(pathname)
  );

  const stepReview = getNextStepReview(
    draft?.data?.step || 0,
    currentUrlPosition + 1
  );

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (building) {
        const reviews = await getReviewsFromUser(auth.currentUser!.uid);

        if (reviews.filter((r) => r.apartment == apartment).length == 2) {
          setIsOpenExistingTwoReviewsAlert(true);
        } else if (
          reviews.filter((r) => r.apartment == apartment).length == 1 &&
          reviews.find((r) => r.apartment == apartment)?.status ==
            ReviewStatus.Published
        ) {
          setIsOpenExistingReviewAlert(true);
        } else {
          setApartment(replaceUndefinedWithNull(apartment));
        }

        const location = building.location;


        if (draft?.address) {
          await updateDraft(auth.currentUser!.uid, {
            address: selectedAddress,
            apartment,
            placeId,
            catastroRef: "", // TODO: fetch catastro in case we can finde ref number
            location,
          });
        } else {
          await createDraft(auth.currentUser!.uid, {
            address: selectedAddress,
            apartment,
            placeId,
            catastroRef: "", // TODO: fetch catastro in case we can finde ref number
            location,
            data: { step: stepReview },
            timeCreated: Timestamp.now(),
          });
        }
        refreshDraft();
        router.push(getUrlReview(stepReview));
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    onSelectAddress();
  }, [selectedAddress]);

  const setSelectedAddressForm = (s: string) => {
    const placeId = s.split("//")[0];
    const address = s.split("//")[1];

    setPlaceId(placeId);
    setSelectedAddress(address);
  };

  return (
    <ReviewFormLayout
      title={t("addressReview.dirección")}
      comment={t("addressReview.comparteExperiencia")}
      commentTitle={t("addressReview.dejanosTuOpinion")}
      image={Message}
    >
      <div className="flex flex-col">
        <label htmlFor="address">{t("addressReview.calleYNúmero")}</label>
        <AddressComboBox
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddressForm}
          areaOptions={false}
        />
        <FieldError>{error}</FieldError>
        <AddressNotFoundHelp
          className="lg:hidden"
          onClick={() => setIsOpenAddressIncorrectAlert(true)}
        />
        {building && (
          <div className="flex gap-3 mt-5">
            <div className="w-full">
              <label>{t("addressReview.escalera")}</label>
              <input
                type="string"
                className="w-full px-4 focus:outline-none"
                placeholder={t("addressReview.escalera")}
                value={apartment?.stair ?? ""}
                onChange={(e) =>
                  setApartment((prev) => ({ ...prev, stair: e.target.value }))
                }
              />
            </div>

            <div className="w-full">
              <label>{t("addressReview.piso")}</label>
              <input
                type="string"
                className="w-full px-4 focus:outline-none"
                placeholder={t("addressReview.piso")}
                value={apartment?.floor ?? ""}
                onChange={(e) =>
                  setApartment((prev) => ({ ...prev, floor: e.target.value }))
                }
              />
            </div>
            <div className="w-full">
              <label>{t("addressReview.puerta")}</label>
              <input
                type="string"
                className="w-full px-4 focus:outline-none"
                placeholder={t("addressReview.puerta")}
                value={apartment?.door ?? ""}
                onChange={(e) =>
                  setApartment((prev) => ({ ...prev, door: e.target.value }))
                }
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end lg:justify-between items-baseline mt-10">
        <AddressNotFoundHelp
          className="hidden lg:block"
          onClick={() => setIsOpenAddressIncorrectAlert(true)}
        />
        {building && (
          <Button
            buttonClassName="btn-primary-500"
            disabled={!selectedAddress}
            onClick={onSubmit}
            loading={loading}
          >
            {t("addressReview.empezar")}
          </Button>
        )}
      </div>
      <AcceptDialog
        isOpen={isOpenExistingTwoReviewsAlert}
        setIsOpen={setIsOpenExistingTwoReviewsAlert}
        acceptText={t("addressReview.deAcuerdo")}
        description={t("addressReview.noPuedesPublicar")}
        title={t("addressReview.maximoReviewsAlcanzado")}
      />
      <AcceptDialog
        isOpen={isOpenExistingReviewAlert}
        setIsOpen={setIsOpenExistingReviewAlert}
        acceptText={t("addressReview.deAcuerdo")}
        description={t("addressReview.yaTienesReviewDesc")}
        title={t("addressReview.yaTienesReview")}
      />
      <Dialog
        isOpen={isOpenAddressIncorrectAlert}
        setIsOpen={setIsOpenAddressIncorrectAlert}
        title={t("addressReview.noEncuentrasDireccion")}
        description={t("addressReview.nosAyudamosGoogle")}
      >
        <div className="text-sm font-bold mt-8 mb-4">
          {t("addressReview.posiblesErrores")}
        </div>
        <div className="grid lg:grid-cols-2 gap-5 ">
          <div className="p-4 border border-gray-300 rounded-md">
            <div className="font-bold mb-2">
              {t("addressReview.redaccionIncorrecta")}
            </div>
            <div>{t("addressReview.revisaErrores")}</div>
          </div>
          <div className="p-4 border border-gray-300 rounded-md">
            <div className="font-bold mb-2">
              {t("addressReview.noHayViviendas")}
            </div>
            <div>{t("addressReview.baseDatosInmuebles")}</div>
          </div>
        </div>

        <div className="text-sm font-bold mt-8 mb-4">
          {t("addressReview.formaCorrecta")}
        </div>
        <div className="p-4 border border-gray-300 rounded-md">
          <div className="font-bold mb-2">
            {t("addressReview.formaCorrecta")}
          </div>
          <div className="bg-gray-100 py-2 px-4 rounded-md">
            {t("addressReview.direccionCorrecta")}
          </div>
        </div>
      </Dialog>
      <AcceptDialog
        isOpen={isOpenReviewAuthenticityAlert}
        setIsOpen={setIsOpenReviewAuthenticityAlert}
        acceptText={t("addressReview.deAcuerdo")}
        description={t("addressReview.reviewWarningContent")}
        title={t("addressReview.reviewWarningTitle")}
        image={HappyHouse}
        imageBeforeContent={true}
        onAccept={() => {
          localStorage.setItem("acceptedReviewTerms", "true");
        }}
      />
    </ReviewFormLayout>
  );
};
