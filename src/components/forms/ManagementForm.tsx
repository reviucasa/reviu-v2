import { FieldError } from "@/components/atoms/FieldError";
import { ReviewFormLayout } from "@/components/layouts/ReviewFormLayout";
import { RadioInput } from "@/components/molecules/RadioInput";
import { yupResolver } from "@hookform/resolvers/yup";
import Face from "public/face.png";
import { useCallback, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { MdDone } from "react-icons/md";
import * as yup from "yup";
import { Back } from "../atoms/Back";
import { Button } from "../atoms/Button";
import { RealAgencyComboBox } from "../atoms/RealAgencyComboBox";
import { useReview } from "@/hooks/swr/useReview";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import { useConfig } from "@/hooks/swr/useConfig";
import { useRouter } from "next/navigation";
import { useStep } from "@/hooks/useStep";
import { getUrlReview } from "@/helpers/stepper";

export const ManagementForm = () => {
  const { review } = useReview();
  const { onSubmitReview } = useSubmitReview("management");
  const { config } = useConfig();
  const router = useRouter();
  const { nextStepReview } = useStep();
  const { t } = useTranslation();

  const [selectedRealStateAgency, setSelectedRealStateAgency] =
    useState<string>();
  const [error, setError] = useState<string>();

  const schema = yup.object({
    isRealStateAgency: yup.boolean().required(t("common.seleccionaOpcion")),
    realStateAgency: yup
      .string()
      /* .when("isRealStateAgency", (isRealStateAgency, schema: yup.StringSchema)=> {
        return isRealStateAgency === true
          ? schema.required(
              t(
                "common.necesitamosSaber",
              )
            )
          : schema;
      }) */,
        
    realStateDealing: yup
      .string()
      /* .when("isRealStateAgency", (isRealStateAgency, schema) => {
        return isRealStateAgency === true
          ? schema.required(
              t("common.seleccionaOpcion")
            )
          : schema;
      }) */,
    landlordDealing: yup
      .string()
      .required(t("common.seleccionaOpcion", "Debes seleccionar una opción")),
    problemSolving: yup.string(),
    deposit: yup.string(),
    adviceRealState: yup.string(),
    adviceLandlord: yup.string(),
  });

  const {
    formState: { isDirty, isValid, errors, isSubmitSuccessful, dirtyFields },
    handleSubmit,
    control,
    watch,
    register,
    reset,
    setValue,
    getValues,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
    defaultValues: review?.data.management,
  });

  const onSelectRealStateAgency = useCallback(async () => {
    setError(undefined);
    if (review && selectedRealStateAgency) {
      try {
        setValue("realStateAgency", selectedRealStateAgency, {
          shouldDirty:
            selectedRealStateAgency !== getValues("realStateAgency"),
        });
      } catch (error) {
        /* if (axios.isAxiosError(error)) {
          if (error.response?.status === 404)
            setError(t("common.noSeEncontroLaInmobiliaria"));
          else setError(error.response?.data.status);
        } */
      }
    }
  }, [selectedRealStateAgency]);

  useEffect(() => {
    if (selectedRealStateAgency) onSelectRealStateAgency();
  }, [selectedRealStateAgency]);

  const handleRouteChange = () => {
    if (isDirty) {
      const resultado = confirm(
        t(
          "common.withSaving",
        )
      );
      if (!resultado) {
        /* router.events.emit("routeChangeError", "routeChange aborted", "", {
          shallow: false,
        }); */ //primer argumento NOMBRE del evento // segundo info ruta actual // tercero ruta destino
        throw "routeChange aborted.";
      }
    }
  };
  useEffect(() => {
    if (review) {
      setSelectedRealStateAgency(review?.data.management?.realStateAgency);
    }
  }, [review?.data.management]);

  useEffect(() => {
    if (isSubmitSuccessful) router.push(getUrlReview(nextStepReview));
  }, [isSubmitSuccessful]);

  /* useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [isDirty]); */

  useEffect(() => {
    reset(review?.data.management);
  }, [review?.data.management]);

  type FormData = yup.InferType<typeof schema>;
  const watchIsRealStateAgency = watch("isRealStateAgency");
  const isFormCompleted = isValid && !isDirty;

  const onSubmit: SubmitHandler<FormData> = (data) => onSubmitReview(data);

  return (
    <ReviewFormLayout
      title={t("managementReview:gestion", "Gestión")}
      image={Face}
      imageAlt="face"
      commentTitle={t("managementReview:seAmable", "Se amable y contructivo")}
      comment={t(
        "managementReview:feedback",
        "El feedback positivo es la mejor manera de comunicar y ser escuchado."
      )}
    >
      {config && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="isRealStateAgency">
              {t(
                "managementReview:gestionadoInmobiliaria",
                "¿Has gestionado el piso a través de una inmobiliaria?"
              )}
            </label>
            <Controller
              name="isRealStateAgency"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.isRealStateAgency}
                  {...field}
                  options={[
                    { label: t("common.si", "Si"), value: true },
                    { label: t("common.no", "No"), value: false },
                  ]}
                />
              )}
            />
            {errors.isRealStateAgency && (
              <FieldError>{errors.isRealStateAgency.message}</FieldError>
            )}
          </div>

          {watchIsRealStateAgency?.valueOf() === true && (
            <div className="flex flex-col">
              <label htmlFor="realStateAgency">
                {t(
                  "managementReview:queInmobiliaria",
                  "¿Qué inmobiliaria lleva o ha llevado la gestión?"
                )}
              </label>

              <RealAgencyComboBox
                selectedRealStateAgency={selectedRealStateAgency}
                setSelectedRealStateAgency={setSelectedRealStateAgency}
              />
              {errors.isRealStateAgency && (
                <FieldError>{errors.isRealStateAgency.message}</FieldError>
              )}
              <FieldError>{error}</FieldError>
            </div>
          )}
          {watchIsRealStateAgency?.valueOf() === true && (
            <div className="flex flex-col">
              <label htmlFor="realStateDealing">
                {t(
                  "managementReview:tratoInmobiliaria",
                  "¿Cómo ha sido el trato de la inmobiliaria?"
                )}
              </label>
              {/* <Controller
                name="realStateDealing"
                control={control}
                render={({ field }) => (
                  <RadioInput
                    ariaInvalid={!!errors.realStateDealing}
                    {...field}
                    options={config.landlord.landlordTreatment}
                  />
                )}
              /> */}
              {errors.realStateDealing && (
                <FieldError>{errors.realStateDealing.message}</FieldError>
              )}
            </div>
          )}
          {watchIsRealStateAgency !== undefined && (
            <>
              <div className="flex flex-col">
                <label htmlFor="landlordDealing">
                  {t(
                    "managementReview:tratoCasero",
                    "¿Cómo ha sido el trato del casero/a?"
                  )}
                </label>
                {/* <Controller
                  name="landlordDealing"
                  control={control}
                  render={({ field }) => (
                    <RadioInput
                      ariaInvalid={!!errors.landlordDealing}
                      {...field}
                      options={config.landlord.landlordTreatment}
                    />
                  )}
                /> */}
                {errors.landlordDealing && (
                  <FieldError>{errors.landlordDealing.message}</FieldError>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <label htmlFor="problemSolving">
                    {t(
                      "managementReview:respuestaProblema",
                      "¿Y la respuesta cuando surgió un problema?"
                    )}
                  </label>
                  <span className="text-gray-500 text-sm">
                    {t("common.opcional", "Opcional")}
                  </span>
                </div>
                {/* <Controller
                  name="problemSolving"
                  control={control}
                  render={({ field }) => (
                    <RadioInput
                      ariaInvalid={!!errors.problemSolving}
                      {...field}
                      options={config.landlord.problemSolving}
                    />
                  )}
                /> */}
                {errors.problemSolving && (
                  <FieldError>{errors.problemSolving.message}</FieldError>
                )}
              </div>
              {/* <div className="flex flex-col">
                {review?.data.stay.currentResidence ? (
                  ""
                ) : (
                  <>
                    <label htmlFor="deposit">
                      {t(
                        "managementReview:fianza",
                        "¿Te devolvieron la fianza?"
                      )}
                    </label>
                    <Controller
                      name="deposit"
                      control={control}
                      render={({ field }) => (
                        <RadioInput
                          {...field}
                          options={config.landlord.deposit}
                        />
                      )}
                    />
                    {errors.deposit && (
                      <FieldError>{errors.deposit.message}</FieldError>
                    )}
                  </>
                )}
              </div> */}
            </>
          )}
          {watchIsRealStateAgency?.valueOf() === true && (
            <div className="flex flex-col">
              <div className="flex justify-between">
                <label htmlFor="adviceRealState">
                  {t(
                    "managementReview:consejosInmobiliaria",
                    "¿Qué consejos le darías a la inmobiliaria?"
                  )}
                </label>
                <span className="text-gray-500 text-sm">
                  {t("common.opcional", "Opcional")}
                </span>
              </div>
              {/* <Controller
                name="adviceRealState"
                control={control}
                render={({ field }) => (
                  <TextAreaWithCharCounter
                    {...field}
                    ariaInvalid={!!errors.adviceRealState}
                    className="w-full h-32"
                    placeholder={t(
                      "managementReview:feedbackPositivo",
                      "Apórtales feedback contructivo"
                    )}
                    name="adviceRealState"
                    control={control}
                  />
                )}
              /> */}
              {errors.adviceRealState && (
                <FieldError>{errors.adviceRealState.message}</FieldError>
              )}
            </div>
          )}
          {watchIsRealStateAgency !== undefined && (
            <>
              {" "}
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <label htmlFor="adviceLandlord">
                    {t(
                      "managementReview:consejosCasero",
                      "¿Qué consejos le darías al casero/a?"
                    )}
                  </label>
                  <span className="text-gray-500 text-sm">
                    {t("common.opcional", "Opcional")}
                  </span>
                </div>
                {/* <Controller
                  name="adviceLandlord"
                  control={control}
                  render={({ field }) => (
                    <TextAreaWithCharCounter
                      {...field}
                      ariaInvalid={!!errors.adviceLandlord}
                      className="w-full h-32"
                      placeholder={t(
                        "managementReview:feedbackPositivo",
                        "Apórtales feedback contructivo"
                      )}
                      name="adviceLandlord"
                      control={control}
                    />
                  )}
                /> */}
                {errors.adviceLandlord && (
                  <FieldError>{errors.adviceLandlord.message}</FieldError>
                )}
              </div>
              <div className="flex justify-between">
                <div>
                  <Back className="lg:hidden" />
                </div>

                <Button
                  buttonClassName={
                    isFormCompleted
                      ? "btn-primary-transparent font-semibold"
                      : "btn-primary-500"
                  }
                  disabled={isFormCompleted}
                >
                  {isFormCompleted
                    ? t("common.guardado", "Guardado")
                    : t("common.guardar", "Guardar")}
                  {isFormCompleted && <MdDone size={22} />}
                </Button>
              </div>
            </>
          )}
        </form>
      )}
    </ReviewFormLayout>
  );
};
function useTranslation(): { t: any } {
  throw new Error("Function not implemented.");
}
