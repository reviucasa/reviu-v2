"use client";
import { Button } from "@/components/atoms/Button";
import { FieldError } from "@/components/atoms/FieldError";
import { AcceptDialog } from "@/components/dialogs/AcceptDialog";
import { ReviewFormLayout } from "@/components/layouts/ReviewFormLayout";
import Message from "../../../public/message.png";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { AddressComboBox } from "../atoms/AddressComboBox";
import { Dialog } from "../atoms/Dialog";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  getNextStepReview,
  getPositionUrlReview,
  getUrlReview,
} from "@/helpers/stepper";
import { createDraft, updateDraft } from "@/models/review";
import { auth } from "@/firebase/config";
import {
  Apartment,
  Building,
  findBuildingByAddress,
  findBuildingByCatastroId,
  getBuildingStairs,
} from "@/models/building";
import { useDraft } from "@/hooks/swr/useDraft";

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
  const [building, setBuilding] = useState<Building>();
  const [aparmentList, setAparmentList] = useState<Apartment[]>([]);
  const [error, setError] = useState<string>();
  const [stairSelected, setStairSelected] = useState<string>();
  const [apartmentSelected, setApartmentSelected] = useState<Apartment>();
  const [isOpenExistingReviewAlert, setIsOpenExistingReviewAlertsetIsOpen] =
    useState(false);
  const [isOpenAddressIncorrectAlert, setIsOpenAddressIncorrectAlert] =
    useState(false);

  useEffect(() => {
    const fetchBuilding = async (buildingId: string) => {
      const b = await findBuildingByCatastroId(buildingId);
      setBuilding(b);
      setStairSelected(draft?.apartment?.stair!);
      setAparmentList(
        b?.apartments.filter((a) => a.stair == draft?.apartment?.stair!) || []
      );
      setApartmentSelected(draft?.apartment);
    };

    if (draft?.address) {
      setSelectedAddress(draft.address);
      if (draft?.apartment) {
        fetchBuilding(draft.buildingId);
      }
    }
  }, [draft]);

  const onSelectAddress = useCallback(async () => {
    setBuilding(undefined);
    setError(undefined);

    if (selectedAddress) {
      const buildingData = await findBuildingByAddress(selectedAddress);

      if (buildingData) {
        setBuilding(buildingData);
      } else {
        setError("No matching address found");
      }
    }
  }, [selectedAddress]);

  const onSelectStair = useCallback(
    (selectedStair: string) => {
      setStairSelected(selectedStair);
      setAparmentList(
        building?.apartments.filter((a) => a.stair == selectedStair) || []
      );
    },
    [building?.apartments]
  );

  const onSelectWholeAddress = (event: ChangeEvent<HTMLSelectElement>) => {
    setApartmentSelected(
      aparmentList.find((a) => a.id == event.currentTarget.value)
    );
  };

  const currentUrlPosition = getPositionUrlReview(pathname);

  const stepReview = getNextStepReview(
    draft?.data?.step || 0,
    currentUrlPosition + 1
  );

  const onSubmit = async () => {
    if (building && apartmentSelected) {
      if (draft?.address) {
        // TODO: add popup when if draft confirming they want to create a new draft with a new address
        await updateDraft(auth.currentUser!.uid, {
          apartment: apartmentSelected,
          buildingId: building.id,
        });
      } else {
        await createDraft(auth.currentUser!.uid, {
          address: selectedAddress,
          apartment: apartmentSelected,
          buildingId: building.id,
          data: { step: stepReview },
        });
      }
      /* revalidateUser(); */
      router.push(getUrlReview(stepReview));
    }
  };

  useEffect(() => {
    if (selectedAddress) onSelectAddress();
  }, [onSelectAddress, selectedAddress]);

  useEffect(() => {
    //If there is only one stair, select it
    if (building && getBuildingStairs(building!).length === 1) {
      onSelectStair(building!.apartments[0].stair!);
    }
  }, [building, onSelectStair]);

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
            {getBuildingStairs(building).length > 1 && (
              <div className="w-full">
                <label>{t("addressReview.escalera")}</label>
                <select
                  className="w-full"
                  value={stairSelected}
                  onChange={(ev) => onSelectStair(ev.target.value)}
                >
                  <option value="">{t("addressReview.escalera")}</option>
                  {getBuildingStairs(building).map((stair) => (
                    <option key={stair} value={stair}>
                      {stair == "" ? "-" : stair}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="w-full">
              <label>{t("addressReview.pisoYPuerta")}</label>
              <select
                className="w-full"
                value={apartmentSelected?.id}
                onChange={onSelectWholeAddress}
              >
                <option value="">{t("addressReview.pisoYPuerta")}</option>
                {aparmentList.map((apartment, index) => (
                  <option
                    key={index}
                    value={apartment.id}
                  >{`${apartment.floor}/${apartment.door}`}</option>
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
            disabled={!apartmentSelected}
            onClick={onSubmit}
          >
            {t("addressReview.empezar")}
          </Button>
        )}
      </div>
      <AcceptDialog
        isOpen={isOpenExistingReviewAlert}
        setIsOpen={setIsOpenExistingReviewAlertsetIsOpen}
        acceptText={t("addressReview.deAcuerdo")}
        description={t("addressReview.NoPuedesPublicar")}
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
          <p className="p-4 border border-gray-300 rounded-md">
            <div className="font-bold mb-2">
              {t("addressReview.redaccionIncorrecta")}
            </div>
            <div>{t("addressReview.revisaErrores")}</div>
          </p>
          <p className="p-4 border border-gray-300 rounded-md">
            <div className="font-bold mb-2">
              {t("addressReview.noHayViviendas")}
            </div>
            <div>{t("addressReview.baseDatosInmuebles")}</div>
          </p>
        </div>

        <div className="text-sm font-bold mt-8 mb-4">
          {t("addressReview.formaCorrecta")}
        </div>
        <p className="p-4 border border-gray-300 rounded-md">
          <div className="font-bold mb-2">
            {t("addressReview.formaCorrecta")}
          </div>
          <div className="bg-gray-100 py-2 px-4 rounded-md">
            {t("addressReview.direccionCorrecta")}
          </div>
        </p>
      </Dialog>
    </ReviewFormLayout>
  );
};
