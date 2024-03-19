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
      /* .when("is_real_state_agency", (isRealStateAgency, schema) => {
        return isRealStateAgency === true
          ? schema.required(
              t("common.seleccionaOpcion")
            )
          : schema;
      }) */,
    landlord_dealing: yup
      .string()
      .required(t("common.seleccionaOpcion", "Debes seleccionar una opción")),
    problem_solving: yup.string(),
    deposit: yup.string(),
    advice_real_state: yup.string(),
    advice_landlord: yup.string(),
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
    defaultValues: review?.review.management,
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
      setSelectedRealStateAgency(review?.review.management?.real_state_agency);
    }
  }, [review?.review.management]);

  useEffect(() => {
    if (isSubmitSuccessful) router.push(getUrlReview(nextStepReview));
  }, [isSubmitSuccessful]);

  /* useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [isDirty]); */

  useEffect(() => {
    reset(review?.review.management);
  }, [review?.review.management]);

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
            <label htmlFor="is_real_state_agency">
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
              <label htmlFor="real_state_agency">
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
              <label htmlFor="real_state_dealing">
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
                    options={config.landlord.landlord_treatment}
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
                <label htmlFor="landlord_dealing">
                  {t(
                    "managementReview:tratoCasero",
                    "¿Cómo ha sido el trato del casero/a?"
                  )}
                </label>
                {/* <Controller
                  name="landlord_dealing"
                  control={control}
                  render={({ field }) => (
                    <RadioInput
                      ariaInvalid={!!errors.landlord_dealing}
                      {...field}
                      options={config.landlord.landlord_treatment}
                    />
                  )}
                /> */}
                {errors.landlord_dealing && (
                  <FieldError>{errors.landlord_dealing.message}</FieldError>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <label htmlFor="problem_solving">
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
                  name="problem_solving"
                  control={control}
                  render={({ field }) => (
                    <RadioInput
                      ariaInvalid={!!errors.problem_solving}
                      {...field}
                      options={config.landlord.problem_solving}
                    />
                  )}
                /> */}
                {errors.problem_solving && (
                  <FieldError>{errors.problem_solving.message}</FieldError>
                )}
              </div>
              {/* <div className="flex flex-col">
                {review?.review.stay.current_residence ? (
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
                <label htmlFor="advice_real_state">
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
                name="advice_real_state"
                control={control}
                render={({ field }) => (
                  <TextAreaWithCharCounter
                    {...field}
                    ariaInvalid={!!errors.advice_real_state}
                    className="w-full h-32"
                    placeholder={t(
                      "managementReview:feedbackPositivo",
                      "Apórtales feedback contructivo"
                    )}
                    name="advice_real_state"
                    control={control}
                  />
                )}
              /> */}
              {errors.advice_real_state && (
                <FieldError>{errors.advice_real_state.message}</FieldError>
              )}
            </div>
          )}
          {watchIsRealStateAgency !== undefined && (
            <>
              {" "}
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <label htmlFor="advice_landlord">
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
                  name="advice_landlord"
                  control={control}
                  render={({ field }) => (
                    <TextAreaWithCharCounter
                      {...field}
                      ariaInvalid={!!errors.advice_landlord}
                      className="w-full h-32"
                      placeholder={t(
                        "managementReview:feedbackPositivo",
                        "Apórtales feedback contructivo"
                      )}
                      name="advice_landlord"
                      control={control}
                    />
                  )}
                /> */}
                {errors.advice_landlord && (
                  <FieldError>{errors.advice_landlord.message}</FieldError>
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
