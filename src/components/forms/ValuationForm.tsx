"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { MdDone } from "react-icons/md";
import * as yup from "yup";
import { Back } from "../atoms/Back";
import { Button } from "../atoms/Button";
import { FieldError } from "../atoms/FieldError";
import { ReviewFormLayout } from "../layouts/ReviewFormLayout";
import { useRouter } from "next/navigation";
import { useStep } from "@/hooks/useStep";
import { getUrlReview } from "@/helpers/stepper";
import { useTranslations } from "next-intl";
import { RadioInput } from "../molecules/RadioInput";
import { reviewConfigParams } from "@/staticData";
import { MultiselectInput } from "../molecules/MultiselectInput";
import { useSubmitDraft } from "@/hooks/useSubmitDraft";
import { useDraft } from "@/hooks/swr/useDraft";

export const ValuationForm = () => {
  const { draft } = useDraft();
  const { onSubmitDraft } = useSubmitDraft("valuation");
  const router = useRouter();
  const { nextStepReview } = useStep();
  const t = useTranslations();
  const config = useTranslations("config");

  const schema = yup.object({
    summerTemperature: yup.string().required(t("common.seleccionaOpcion")),
    winterTemperature: yup.string().required(t("common.seleccionaOpcion")),
    noise: yup.string().required(t("common.seleccionaOpcion")),
    light: yup.string().required(t("common.seleccionaOpcion")),
    maintenance: yup.string().required(t("common.seleccionaOpcion")),
    services: yup.array(),
  });
  const {
    formState: { isDirty, isValid, errors, isSubmitSuccessful },
    handleSubmit,
    control,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
    defaultValues: draft?.data?.valuation,
  });
  const isFormCompleted = isValid && !isDirty;

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
    if (isSubmitSuccessful) router.push(getUrlReview(nextStepReview));
  }, [isSubmitSuccessful, nextStepReview, router]);

  /* useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [isDirty]); */

  useEffect(() => {
    reset(draft?.data?.valuation);
  }, [draft?.data?.valuation]);

  type FormData = yup.InferType<typeof schema>;

  const onSubmit: SubmitHandler<FormData> = async (data) => onSubmitDraft(data);

  return (
    <ReviewFormLayout title={t("common.valoracionPiso")}>
      {
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="currentResidence">
              {t("common.temperaturaVerano")}
            </label>
            <Controller
              name="summerTemperature"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.summerTemperature}
                  {...field}
                  options={reviewConfigParams.buildingQuality.summerTemperature.map(
                    (e) => {
                      return {
                        label: config(`buildingQuality.summerTemperature.${e}`),
                        value: e,
                      };
                    }
                  )}
                />
              )}
            />
            {errors.summerTemperature && (
              <FieldError>{errors.summerTemperature.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="currentResidence">
              {t("common.temperaturaInvierno")}
            </label>
            <Controller
              name="winterTemperature"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.winterTemperature}
                  {...field}
                  options={reviewConfigParams.buildingQuality.winterTemperature.map(
                    (e) => {
                      return {
                        label: config(`buildingQuality.winterTemperature.${e}`),
                        value: e,
                      };
                    }
                  )}
                />
              )}
            />
            {errors.winterTemperature && (
              <FieldError>{errors.winterTemperature.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="currentResidence">{t("common.ruido")}</label>
            <Controller
              name="noise"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.noise}
                  {...field}
                  options={reviewConfigParams.buildingQuality.noise.map((e) => {
                    return {
                      label: config(`buildingQuality.noise.${e}`),
                      value: e,
                    };
                  })}
                />
              )}
            />
            {errors.noise && <FieldError>{errors.noise.message}</FieldError>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="currentResidence">{t("common.luz")}</label>
            <Controller
              name="light"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.light}
                  {...field}
                  options={reviewConfigParams.buildingQuality.light.map((e) => {
                    return {
                      label: config(`buildingQuality.light.${e}`),
                      value: e,
                    };
                  })}
                />
              )}
            />
            {errors.light && <FieldError>{errors.light.message}</FieldError>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="currentResidence">
              {t("valuationForm.estadoPiso")}
            </label>
            <Controller
              name="maintenance"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.maintenance}
                  {...field}
                  options={reviewConfigParams.buildingQuality.maintenance.map(
                    (e) => {
                      return {
                        label: config(`buildingQuality.maintenance.${e}`),
                        value: e,
                      };
                    }
                  )}
                />
              )}
            />
            {errors.maintenance && (
              <FieldError>{errors.maintenance.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="currentResidence">{t("common.services")}</label>{" "}
              <span className="text-gray-500 text-sm">
                {t("valuationForm.eligeTantasComoQuieras")}
              </span>
            </div>
            <Controller
              name="services"
              control={control}
              render={({ field }) => (
                <MultiselectInput
                  ariaInvalid={!!errors.services}
                  {...field}
                  options={reviewConfigParams.buildingQuality.services.map(
                    (e) => {
                      return {
                        label: config(`buildingQuality.services.${e}`),
                        value: e,
                      };
                    }
                  )}
                />
              )}
            />
            {errors.services && (
              <FieldError>{errors.services.message}</FieldError>
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
              {isFormCompleted ? (
                <>
                  {t("common.guardado")}
                  <MdDone size={22} />
                </>
              ) : (
                <>{t("common.guardar")}</>
              )}
            </Button>
          </div>
        </form>
      }
    </ReviewFormLayout>
  );
};
