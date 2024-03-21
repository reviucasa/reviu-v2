"use client";
import { Button } from "@/components/atoms/Button";
import { FieldError } from "@/components/atoms/FieldError";
import { AcceptDialog } from "@/components/dialogs/AcceptDialog";
import { ReviewFormLayout } from "@/components/layouts/ReviewFormLayout";
import Message from "../../../public/message.png";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { AdressComboBox } from "../atoms/AdressComboBox";
import { Dialog } from "../atoms/Dialog";
import { useReview } from "@/hooks/swr/useReview";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Apartment, BuildingResponse } from "@/models/types";
import {
  getNextStepReview,
  getPositionUrlReview,
  getUrlReview,
} from "@/helpers/stepper";
import { createReview, updateReview } from "@/models/review";
import { auth } from "@/firebase/config";

export const AddressForm = () => {
  const { review } = useReview();
  /* const { revalidateUser } = useUser() */
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
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [building, setBuilding] = useState<BuildingResponse>();
  const [aparmentList, setAparmentList] = useState<Apartment[]>([]);
  const [error, setError] = useState<string>();
  const [stairSelected, setStairSelected] = useState<string>();
  const [apartmentSelected, setApartmentSelected] = useState<string>();
  const [isOpenExistingReviewAlert, setIsOpenExistingReviewAlertsetIsOpen] =
    useState(false);
  const [isOpenAddressIncorrectAlert, setIsOpenAddressIncorrectAlert] =
    useState(false);

  useEffect(() => {
    if (review) {
      setSelectedAddress(review.address);
    }
  }, [review]);

  useEffect(() => {
    /* if (review?.apartment?.stair) {
      onSelectStair(review?.apartment?.stair);
    }
    setApartmentSelected(review?.apartment?.id); */
  }, [review, building]);

  const onSelectAddress = useCallback(async () => {
    setBuilding(undefined);
    setError(undefined);
    if (selectedAddress) {
      /* try {
        const response = await searchBuilding(selectedAddress);
        setBuilding(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404)
            setError(t("common.noSeEncontroDirección"));
          else setError(error.response?.data.status);
        }
      } */
    }
  }, [selectedAddress]);

  const onSelectStair = (selectedStair: string) => {
    setStairSelected(selectedStair);
    const theStair = building?.building.building_stairs.find(
      (stair) => stair.stair === selectedStair
    );
    const allApartments = theStair?.building_floors
      .map((floor) => floor.apartments)
      .flat();
    setAparmentList(allApartments || []);
  };

  const onSelectHoleAddress = (event: ChangeEvent<HTMLSelectElement>) => {
    setApartmentSelected(event.currentTarget.value);
  };

  const currentUrlPosition = getPositionUrlReview(pathname);
  const stepReview = getNextStepReview(
    review?.data?.step || 0,
    currentUrlPosition + 1
  );

  const onSubmit = async () => {
    if (building && apartmentSelected) {
      try {
        if (review) {
          await updateReview(auth.currentUser!.uid, {
            apartment: {id: apartmentSelected},
            buildingId: building.building.id,
          });
        } else {
          await createReview(auth.currentUser!.uid, {
            apartment: {id: apartmentSelected},
            buildingId: building.building.id,
            data: { step: stepReview },
          });
        }
        /* revalidateUser(); */
        router.push(getUrlReview(stepReview));
      } catch (error) {
        /* if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            setIsOpenExistingReviewAlertsetIsOpen(true);
          } else {
            setError(error.response?.data.status);
          }
        } */
      }
    }
  };

  useEffect(() => {
    if (selectedAddress) onSelectAddress();
  }, [selectedAddress]);

  useEffect(() => {
    //If there is only one stair, select it
    if (building?.building.building_stairs.length === 1)
      onSelectStair(building.building.building_stairs[0].stair);
  }, [building]);

  return (
    <ReviewFormLayout
      title={t("addressReview.dirección")}
      comment={t("addressReview.comparteExperiencia")}
      commentTitle={t("addressReview.dejanosTuOpinion")}
      image={Message}
    >
      <div className="flex flex-col">
        <label htmlFor="address">{t("addressReview.calleYNúmero")}</label>
        <AdressComboBox
          selectedAdress={selectedAddress}
          setSelectedAdress={setSelectedAddress}
        />
        <FieldError>{error}</FieldError>
        <AddressNotFoundHelp
          className="lg:hidden"
          onClick={() => setIsOpenAddressIncorrectAlert(true)}
        />
        {building && (
          <div className="flex gap-3 mt-5">
            {building.building.building_stairs.length > 1 && (
              <div className="w-full">
                <label>{t("addressReview.escalera")}</label>
                <select
                  className="w-full"
                  value={stairSelected}
                  onChange={(ev) => onSelectStair(ev.target.value)}
                >
                  <option value="">{t("addressReview.escalera")}</option>
                  {building.building.building_stairs.map((stair) => (
                    <option key={stair.stair} value={stair.stair}>
                      {stair.stair}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="w-full">
              <label>{t("addressReview.pisoYPuerta")}</label>
              <select
                className="w-full"
                value={apartmentSelected}
                onChange={onSelectHoleAddress}
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
