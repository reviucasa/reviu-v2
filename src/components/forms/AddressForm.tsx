"use client";
import { Button } from "@/components/atoms/Button";
import { FieldError } from "@/components/atoms/FieldError";
import { AcceptDialog } from "@/components/dialogs/AcceptDialog";
import { ReviewFormLayout } from "@/components/layouts/ReviewFormLayout";
import Message from "public/images/message.png";
import HappyHouse from "public/images/happyHouse.png";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
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
  Location,
  ReviewStatus,
  updateDraft,
} from "@/models/review";
import { auth } from "@/firebase/config";
import { useDraft } from "@/hooks/swr/useDraft";
import { removeLocaleFromPath } from "../atoms/DropDownLanguages";
import { Timestamp } from "firebase/firestore";
import { CatastroResponse, Unidad } from "@/models/catastro";
import {
  getCatastroDataFromAddress,
  getCatastroDataFromReference,
  getCoordinatesFromCatastroRef,
} from "@/helpers/catastroFunctions";
import { replaceUndefinedWithNull } from "@/helpers/replaceUndefinedWithNull";

export const AddressForm = () => {
  const { draft } = useDraft();
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
  const [building, setBuilding] = useState<CatastroResponse>();
  const [catastroRef, setCatastroRef] = useState<string>();
  const [unitsList, setUnitsList] = useState<Unidad[]>([]);
  const [error, setError] = useState<string>();
  const [selectedStair, setSelectedStair] = useState<string>();
  const [selectedUnit, setSelectedUnit] = useState<Unidad>();
  const [isOpenReviewAuthenticityAlert, setIsOpenReviewAuthenticityAlert] =
    useState(false);
  const [isOpenExistingReviewAlert, setIsOpenExistingReviewAlert] =
    useState(false);
  const [isOpenExistingTwoReviewsAlert, setIsOpenExistingTwoReviewsAlert] =
    useState(false);
  const [isOpenAddressIncorrectAlert, setIsOpenAddressIncorrectAlert] =
    useState(false);

  useEffect(() => {
    const fetchBuilding = async (catRef: string) => {
      const b = await getCatastroDataFromReference(catRef);
      if (b) {
        setBuilding(b);
        setUnitsList(
          b.response.bico?.listaConstrucciones.map(
            (c) => c.detallesUbicacion.localizacionUrbana.unidad
          ) ??
            b.response.listaRegistroCatastral?.registros.map(
              (r) => r.localizacion.ubicacion.unidad
            ) ??
            []
        );
      }
    };

    const acceptedTerms = localStorage.getItem("acceptedReviewTerms");
    // Check if the terms have not been accepted yet
    if (acceptedTerms == null) {
      setIsOpenReviewAuthenticityAlert(true);
    }

    if (draft?.address) {
      setCatastroRef(draft.catastroRef);
      setSelectedAddress(draft.address);
      if (draft?.apartment) {
        setSelectedStair(draft.apartment.stair);
        setSelectedUnit(draft.apartment);
        fetchBuilding(draft.catastroRef);
      }
    }
  }, [draft]);

  const onSelectAddress = useCallback(async () => {
    setBuilding(undefined);
    setError(undefined);

    if (selectedAddress) {
      const res = await getCatastroDataFromAddress(selectedAddress);
      if (res) {
        const units =
          res.response.bico?.listaConstrucciones.map(
            (c) => c.detallesUbicacion.localizacionUrbana.unidad
          ) ??
          res.response.listaRegistroCatastral?.registros.map(
            (r) => r.localizacion.ubicacion.unidad
          );
        const err = res.response.errores;
        if (units) {
          setCatastroRef(
            res.response.listaRegistroCatastral?.registros[0]
              .referenciaCatastral.edificio ??
              res.response.bico?.identificacionBienInmueble.referenciaCatastral
                .edificio
          );
          setBuilding(res);
          setUnitsList(units);
          setSelectedStair(undefined);
          setSelectedUnit(undefined);
        } else if (err) {
          const num = res.response.numerero;
          if (num) {
            setError(
              t("common.noSeEncontroDirección") +
                `. Options: ${num.map((n) => n.numero).toString()}`
            );
          } else {
            setError(err[0].desc);
          }
        } else {
          console.log("error fetching:", selectedAddress);
        }
      } else {
        console.log("catastro data not found");
        const addressRegex = /^(.*?),\s*(\d+)/;
        const match = selectedAddress.match(addressRegex);
        if (!match) {
          setError(t("common.missingStreetNumber"));
        } else {
          setError(t("common.noSeEncontroDirección"));
        }
      }
    }
  }, [selectedAddress, t]);

  const onSelectStair = useCallback((stair: string) => {
    setSelectedStair(stair);
    // setUnitsList(unitsList.filter((a) => a.stair == stair) || []);
  }, []);

  const onSelectWholeAddress = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const unit = unitsList[Number(event.currentTarget.value)];

    const reviews = await getReviewsFromUser(auth.currentUser!.uid);
    if (reviews.filter((r) => r.apartment?.id == unit?.id).length == 2) {
      setIsOpenExistingTwoReviewsAlert(true);
    } else if (
      reviews.filter((r) => r.apartment?.id == unit?.id).length == 1 &&
      reviews.find((r) => r.apartment?.id == unit?.id)?.status ==
        ReviewStatus.Published
    ) {
      setIsOpenExistingReviewAlert(true);
    } else {
      setSelectedUnit(replaceUndefinedWithNull(unit));
    }
  };

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
      if (building && selectedUnit) {
        const locationData =
          building.response.listaRegistroCatastral?.registros[0].localizacion ??
          building.response.bico?.localizacion!;

        const coordinates = await getCoordinatesFromCatastroRef(catastroRef!);

        const location: Location = {
          type: locationData.ubicacion.direccion.siglas.toLowerCase(),
          street: locationData.ubicacion.direccion.nombre.toLowerCase(),
          number: Number(locationData.ubicacion.direccion.numero),
          municipality: locationData.municipio.toLowerCase(),
          province: locationData.provincia.toLowerCase(),
          coordinates: {
            latitude: coordinates!.coordinates[0].latitude,
            longitude: coordinates!.coordinates[0].longitude,
          },
        };

        // console.log(location);

        if (draft?.address) {
          await updateDraft(auth.currentUser!.uid, {
            address: selectedAddress,
            apartment: selectedUnit,
            catastroRef,
            location,
          });
        } else {
          await createDraft(auth.currentUser!.uid, {
            address: selectedAddress,
            apartment: selectedUnit,
            catastroRef,
            location,
            data: { step: stepReview },
            timeCreated: Timestamp.now(),
          });
        }
        router.push(getUrlReview(stepReview));
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (selectedAddress) onSelectAddress();
  }, [onSelectAddress, selectedAddress]);

  useEffect(() => {
    //If there is only one stair, select it
    if (building && unitsList.map((u) => u.stair).length === 1) {
      onSelectStair(unitsList[0].stair!);
    }
  }, [building, onSelectStair, unitsList]);

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
          setSelectedAddress={setSelectedAddress}
        />
        <FieldError>{error}</FieldError>
        <AddressNotFoundHelp
          className="lg:hidden"
          onClick={() => setIsOpenAddressIncorrectAlert(true)}
        />
        {building && (
          <div className="flex gap-3 mt-5">
            {Array.from(new Set(unitsList.map((u) => u.stair))).length > 1 && (
              <div className="w-full">
                <label>{t("addressReview.escalera")}</label>
                <select
                  className="w-full"
                  value={
                    selectedStair == "" ||
                    selectedStair == undefined ||
                    selectedStair == null
                      ? t("addressReview.main")
                      : selectedStair
                  }
                  onChange={(ev) => onSelectStair(ev.target.value)}
                >
                  <option value={selectedStair}>
                    {selectedStair ?? t("addressReview.escalera")}
                  </option>
                  {Array.from(new Set(unitsList.map((u) => u.stair))).map(
                    (stair, i) => (
                      <option key={i} value={stair}>
                        {stair == "" || stair == undefined || stair == null
                          ? t("addressReview.main")
                          : stair}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}
            <div className="w-full">
              <label>{t("addressReview.pisoYPuerta")}</label>
              <select
                className="w-full"
                value={
                  selectedUnit &&
                  unitsList
                    .map((u) => replaceUndefinedWithNull(u))
                    .findIndex(
                      (a) =>
                        a.stair == selectedUnit.stair &&
                        a.floor == selectedUnit.floor &&
                        a.door == selectedUnit.door
                    )
                }
                onChange={onSelectWholeAddress}
              >
                <option
                  value={
                    selectedUnit == undefined
                      ? t("addressReview.pisoYPuerta")
                      : `${selectedUnit.floor ?? ""}/${selectedUnit.door ?? ""}`
                  }
                >
                  {t("addressReview.pisoYPuerta")}
                </option>
                {unitsList
                  .filter((u) => (u.stair ? u.stair == selectedStair : true))
                  .map((unit, i) => (
                    <option key={i} value={unitsList.indexOf(unit)}>{`${
                      unit.floor ?? ""
                    }/${unit.door ?? ""}`}</option>
                  ))}
              </select>
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
            disabled={!selectedUnit}
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
