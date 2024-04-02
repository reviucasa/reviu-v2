"use client";
import { FieldError } from "@/components/atoms/FieldError";
import { ReviewFormLayout } from "@/components/layouts/ReviewFormLayout";
import { RadioInput } from "@/components/molecules/RadioInput";
import { yupResolver } from "@hookform/resolvers/yup";
import Face from "../../../public/face.png";
import { useCallback, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { MdDone } from "react-icons/md";
import * as yup from "yup";
import { Back } from "../atoms/Back";
import { Button } from "../atoms/Button";
import { RealAgencyComboBox } from "../atoms/RealAgencyComboBox";
import { useReview } from "@/hooks/swr/useReview";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import { useRouter } from "next/navigation";
import { useStep } from "@/hooks/useStep";
import { getUrlReview } from "@/helpers/stepper";
import { useTranslations } from "next-intl";
import { reviewConfigParams } from "@/staticData";
import { useDraft } from "@/hooks/swr/useDraft";
import TextAreaWithCharCounter from "../molecules/TexareaCounter";
import { useSubmitDraft } from "@/hooks/useSubmitDraft";

export const ManagementForm = () => {
  const { draft } = useDraft();
  const { onSubmitDraft } = useSubmitDraft("management");
  const router = useRouter();
  const { nextStepReview } = useStep();
  const t = useTranslations();
  const config = useTranslations("config");

  const [selectedRealStateAgency, setSelectedRealStateAgency] =
    useState<string>();
  const [error, setError] = useState<string>();

  const schema = yup.object({
    isRealStateAgency: yup.boolean().required(t("common.seleccionaOpcion")),
    realStateAgency: yup
      .string()
      .when(
        "isRealStateAgency",
        (isRealStateAgency, schema: yup.StringSchema) => {
          return isRealStateAgency === true
            ? schema.required(t("common.necesitamosSaber"))
            : schema;
        }
      ),
    realStateDealing: yup
      .string()
      .when("isRealStateAgency", (isRealStateAgency, schema) => {
        return isRealStateAgency === true
          ? schema.required(t("common.seleccionaOpcion"))
          : schema;
      }),
    landlordDealing: yup.string().required(t("common.seleccionaOpcion")),
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
    defaultValues: draft?.data.management,
  });

  const onSelectRealStateAgency = useCallback(async () => {
    setError(undefined);
    if (draft && selectedRealStateAgency) {
      try {
        setValue("realStateAgency", selectedRealStateAgency, {
          shouldDirty: selectedRealStateAgency !== getValues("realStateAgency"),
        });
      } catch (error) {
        /* if (axios.isAxiosError(error)) {
          if (error.response?.status === 404)
            setError(t("common.noSeEncontroLaInmobiliaria"));
          else setError(error.response?.data.status);
        } */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRealStateAgency]);

  useEffect(() => {
    if (selectedRealStateAgency) onSelectRealStateAgency();
  }, [onSelectRealStateAgency, selectedRealStateAgency]);

  /* const handleRouteChange = () => {
    if (isDirty) {
      const resultado = confirm(t("common.withSaving"));
      if (!resultado) {
        router.events.emit("routeChangeError", "routeChange aborted", "", {
          shallow: false,
        }); //primer argumento NOMBRE del evento // segundo info ruta actual // tercero ruta destino
        throw "routeChange aborted.";
      }
    }
  }; */

  useEffect(() => {
    if (draft) {
      setSelectedRealStateAgency(draft?.data.management?.realStateAgency);
    }
  }, [draft, draft?.data.management]);

  useEffect(() => {
    if (isSubmitSuccessful) router.push(getUrlReview(nextStepReview));
  }, [isSubmitSuccessful, nextStepReview, router]);

  /* useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [isDirty]); */

  useEffect(() => {
    reset(draft?.data.management);
  }, [reset, draft?.data.management]);

  type FormData = yup.InferType<typeof schema>;
  const watchIsRealStateAgency = watch("isRealStateAgency");
  const isFormCompleted = isValid && !isDirty;

  const onSubmit: SubmitHandler<FormData> = (data) => onSubmitDraft(data);

  return (
    <ReviewFormLayout
      title={t("managementReview.gestion")}
      image={Face}
      imageAlt="face"
      commentTitle={t("managementReview.seAmable")}
      comment={t("managementReview.feedback")}
    >
      {
        /* config && */ <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col">
            <label htmlFor="isRealStateAgency">
              {t("managementReview.gestionadoInmobiliaria")}
            </label>
            <Controller
              name="isRealStateAgency"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.isRealStateAgency}
                  {...field}
                  options={[
                    { label: t("common.si"), value: true },
                    { label: t("common.no"), value: false },
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
                {t("managementReview.queInmobiliaria")}
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
                {t("managementReview.tratoInmobiliaria")}
              </label>
              <Controller
                name="realStateDealing"
                control={control}
                render={({ field }) => (
                  <RadioInput
                    ariaInvalid={!!errors.realStateDealing}
                    {...field}
                    options={reviewConfigParams.landlord.landlordTreatment.map(
                      (e) => {
                        return {
                          label: config(`landlord.landlordTreatment.${e}`),
                          value: e,
                        };
                      }
                    )}
                  />
                )}
              />
              {errors.realStateDealing && (
                <FieldError>{errors.realStateDealing.message}</FieldError>
              )}
            </div>
          )}
          {watchIsRealStateAgency !== undefined && (
            <>
              <div className="flex flex-col">
                <label htmlFor="landlordDealing">
                  {t("managementReview.tratoCasero")}
                </label>
                <Controller
                  name="landlordDealing"
                  control={control}
                  render={({ field }) => (
                    <RadioInput
                      ariaInvalid={!!errors.landlordDealing}
                      {...field}
                      options={reviewConfigParams.landlord.landlordTreatment.map(
                        (e) => {
                          return {
                            label: config(`landlord.landlordTreatment.${e}`),
                            value: e,
                          };
                        }
                      )}
                    />
                  )}
                />
                {errors.landlordDealing && (
                  <FieldError>{errors.landlordDealing.message}</FieldError>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <label htmlFor="problemSolving">
                    {t("managementReview.respuestaProblema")}
                  </label>
                  <span className="text-gray-500 text-sm">
                    {t("common.opcional")}
                  </span>
                </div>
                <Controller
                  name="problemSolving"
                  control={control}
                  render={({ field }) => (
                    <RadioInput
                      ariaInvalid={!!errors.problemSolving}
                      {...field}
                      options={reviewConfigParams.landlord.problemSolving.map(
                        (e) => {
                          return {
                            label: config(`landlord.problemSolving.${e}`),
                            value: e,
                          };
                        }
                      )}
                    />
                  )}
                />
                {errors.problemSolving && (
                  <FieldError>{errors.problemSolving.message}</FieldError>
                )}
              </div>
              <div className="flex flex-col">
                {draft?.data?.stay?.currentResidence ? (
                  ""
                ) : (
                  <>
                    <label htmlFor="deposit">
                      {t("managementReview.fianza")}
                    </label>
                    <Controller
                      name="deposit"
                      control={control}
                      render={({ field }) => (
                        <RadioInput
                          {...field}
                          options={reviewConfigParams.landlord.deposit.map(
                            (e) => {
                              return {
                                label: config(`landlord.deposit.${e}`),
                                value: e,
                              };
                            }
                          )}
                        />
                      )}
                    />
                    {errors.deposit && (
                      <FieldError>{errors.deposit.message}</FieldError>
                    )}
                  </>
                )}
              </div>
            </>
          )}
          {watchIsRealStateAgency?.valueOf() === true && (
            <div className="flex flex-col">
              <div className="flex justify-between">
                <label htmlFor="adviceRealState">
                  {t("managementReview.consejosInmobiliaria")}
                </label>
                <span className="text-gray-500 text-sm">
                  {t("common.opcional")}
                </span>
              </div>
              <Controller
                name="adviceRealState"
                control={control}
                render={({ field }) => (
                  <TextAreaWithCharCounter
                    {...field}
                    ariaInvalid={!!errors.adviceRealState}
                    className="w-full h-32"
                    placeholder={t("managementReview.feedbackPositivo")}
                    name="adviceRealState"
                    control={control}
                  />
                )}
              />
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
                    {t("managementReview.consejosCasero")}
                  </label>
                  <span className="text-gray-500 text-sm">
                    {t("common.opcional")}
                  </span>
                </div>
                <Controller
                  name="adviceLandlord"
                  control={control}
                  render={({ field }) => (
                    <TextAreaWithCharCounter
                      {...field}
                      ariaInvalid={!!errors.adviceLandlord}
                      className="w-full h-32"
                      placeholder={t("managementReview.feedbackPositivo")}
                      name="adviceLandlord"
                      control={control}
                    />
                  )}
                />
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
                  {isFormCompleted ? t("common.guardado") : t("common.guardar")}
                  {isFormCompleted && <MdDone size={22} />}
                </Button>
              </div>
            </>
          )}
        </form>
      }
    </ReviewFormLayout>
  );
};
