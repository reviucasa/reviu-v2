"use client";
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
import { AgencyComboBox } from "../atoms/AgencyComboBox";
import { useRouter } from "next/navigation";
import { useStep } from "@/hooks/useStep";
import { getUrlReview } from "@/helpers/stepper";
import { useTranslations } from "next-intl";
import { reviewConfigParams } from "@/staticData";
import { useDraft } from "@/hooks/swr/useDraft";
import TextAreaWithCharCounter from "../molecules/TexareaCounter";
import { useSubmitDraft } from "@/hooks/useSubmitDraft";
import { RealStateAgency, getAgency } from "@/models/agency";

export const ManagementForm = () => {
  const { draft, refreshDraft } = useDraft();
  const { onSubmitDraft } = useSubmitDraft("management");
  const router = useRouter();
  const { nextStepReview } = useStep();
  const t = useTranslations();
  const config = useTranslations("config");

  const [isRealStateAgencyManual, setIsRealStateAgencyManual] =
    useState<boolean>(false);
  const [selectedRealStateAgency, setSelectedRealStateAgency] =
    useState<RealStateAgency>();
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
      setValue("realStateAgency", selectedRealStateAgency.name, {
        shouldDirty:
          selectedRealStateAgency.name !== getValues("realStateAgency"),
      });
    }
  }, [draft, getValues, selectedRealStateAgency, setValue]);

  useEffect(() => {
    if (selectedRealStateAgency) onSelectRealStateAgency();
  }, [onSelectRealStateAgency, selectedRealStateAgency]);

  useEffect(() => {
    const fetchAgencyDetails = async (agencyId: string) => {
      try {
        const agencyData = await getAgency(agencyId);
        setSelectedRealStateAgency(agencyData);
      } catch (error) {
        console.error("Failed to fetch real state agency details", error);
      }
    };

    if (
      draft?.data.management?.agencyId &&
      draft?.data.management?.agencyId !== ""
    ) {
      fetchAgencyDetails(draft?.data.management?.agencyId);
    } else if (draft?.data.management?.agencyId == "") {
      setIsRealStateAgencyManual(true);
      setSelectedRealStateAgency({
        documentId: "",
        id: "",
        name: draft?.data.management?.realStateAgency,
      });
    }
  }, [draft, draft?.data.management]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      refreshDraft();
      router.push(getUrlReview(nextStepReview));
    }
  }, [isSubmitSuccessful, nextStepReview, refreshDraft, router]);

  useEffect(() => {
    reset(draft?.data.management);
  }, [reset, draft?.data.management]);

  type FormData = yup.InferType<typeof schema>;
  const watchIsRealStateAgency = watch("isRealStateAgency");

  const isFormCompleted = isValid && !isDirty;

  const onSubmit: SubmitHandler<FormData> = (data) =>
    onSubmitDraft({
      ...data,
      agencyId: selectedRealStateAgency?.documentId ?? "",
    });

  return (
    <ReviewFormLayout
      title={t("managementReview.gestion")}
      image={Face}
      imageAlt="face"
      commentTitle={t("managementReview.seAmable")}
      comment={t("managementReview.feedback")}
    >
      {
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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

              {isRealStateAgencyManual ? (
                <Controller
                  name="realStateAgency"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      aria-invalid={!!errors.isRealStateAgency}
                      type="text"
                      className="w-full"
                      placeholder={t(
                        "managementReview.escribeImmobiliariaManualmente"
                      )}
                    />
                  )}
                />
              ) : (
                <AgencyComboBox
                  selectedRealStateAgency={selectedRealStateAgency}
                  setSelectedRealStateAgency={setSelectedRealStateAgency}
                />
              )}
              <div className="relative flex items-start mt-2">
                <div className="flex h-6 items-center">
                  <input
                    id="agencyNotFound"
                    aria-describedby="comments-description"
                    name="agencyNotFound"
                    type="checkbox"
                    checked={isRealStateAgencyManual}
                    className="h-4 w-4 !rounded-md border-gray-300"
                    onChange={() => {
                      setSelectedRealStateAgency(undefined);
                      setValue("realStateAgency", undefined, {
                        shouldDirty: true,
                      });
                      setIsRealStateAgencyManual(!isRealStateAgencyManual);
                    }}
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label
                    htmlFor="agencyNotFound"
                    className="font-normal text-gray-900"
                  >
                    {t("managementReview.noEncuentroInmobiliaria")}
                  </label>
                </div>
              </div>
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
