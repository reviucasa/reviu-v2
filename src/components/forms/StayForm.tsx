"use client";
import { FieldError } from "@/components/atoms/FieldError";
import { ReviewFormLayout } from "@/components/layouts/ReviewFormLayout";
import { RadioInput } from "@/components/molecules/RadioInput";
import { yupResolver } from "@hookform/resolvers/yup";
import padlock from "public/images/padlock.png";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { MdDone } from "react-icons/md";
import * as yup from "yup";
import { Back } from "../atoms/Back";
import { Button } from "../atoms/Button";
import { useTranslations } from "next-intl";
import { range } from "@/helpers/generateRange";
import { useSubmitDraft } from "@/hooks/useSubmitDraft";
import { useDraft } from "@/hooks/swr/useDraft";
import { useRouter } from "@/navigation";
import { getUrlReview } from "@/helpers/stepper";
import { useStep } from "@/hooks/useStep";

export const StayForm = () => {
  const { draft, refreshDraft } = useDraft();
  const { onSubmitDraft } = useSubmitDraft("stay");
  const t = useTranslations();
  const router = useRouter();
  const { nextStepReview } = useStep();

  const schema = yup.object({
    currentResidence: yup.boolean().required(),
    startMonth: yup.string().when(["currentResidence"], {
      is: (currentResidence: boolean) => currentResidence === true,
      then: yup.string().required(t("common.seleccionaMes")),
      otherwise: yup
        .string()
        .required(t("common.seleccionaMes"))
        .test("validStartMonth", t("common.mesInicio"), function (value) {
          const { currentResidence, _startYear } = this.parent;
          if (currentResidence === true && value) {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            const startYear = parseInt(_startYear);
            const startMonth = parseInt(value);
            if (startYear > currentYear) {
              return false;
            }
            if (startYear === currentYear && startMonth > currentMonth) {
              return false;
            }
          }
          return true;
        }),
    }),
    startYear: yup.string().required(t("common.seleccionaAño")),
    endYear: yup.string().when(["currentResidence", "startYear"], {
      is: (currentResidence: boolean) => currentResidence === false,
      then: yup
        .string()
        .required(t("common.seleccionaAño"))
        .test("validYear", t("common.añoSalida"), function (value) {
          const { _startYear } = this.parent;
          if (!_startYear || !value) {
            return true;
          }
          const startYear = parseInt(_startYear);
          const endYear = parseInt(value);
          return endYear >= startYear;
        }),
    }),
    endMonth: yup
      .string()
      .when(["currentResidence", "startYear", "startMonth"], {
        is: (currentResidence: boolean) => currentResidence === false,
        then: yup
          .string()
          .required(t("common.seleccionaMes"))
          .test("validEndMonth", t("common.mesSalida"), function (value) {
            const { _startYear, _startMonth, _endYear } = this.parent;
            if (!_startYear || !_startMonth || !value) {
              return true;
            }
            const startYear = parseInt(_startYear);
            const endYear = parseInt(_endYear);
            const startMonth = parseInt(_startMonth);
            const endMonth = parseInt(value);
            if (startYear === endYear) {
              return endMonth >= startMonth;
            }
            return true;
          }),
      }),
    startPrice: yup.string().required(t("common.seleccionaPrecio")),
    endPrice: yup
      .string()
      .when("currentResidence", (currentResidence, schema) => {
        return currentResidence === false
          ? schema.required(t("common.seleccionaPrecio"))
          : schema;
      }),
  });

  const {
    formState: { isDirty, isValid, errors, isSubmitSuccessful },
    register,
    handleSubmit,
    control,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
    defaultValues: draft?.data?.stay,
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
    if (isSubmitSuccessful) {
      refreshDraft();
      router.push(getUrlReview(nextStepReview));
    }
  }, [isSubmitSuccessful, nextStepReview, refreshDraft, router]);

  /* useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [isDirty]); */

  useEffect(() => {
    reset(draft?.data?.stay);
  }, [draft?.data?.stay, reset]);

  type FormData = yup.InferType<typeof schema>;

  const onSubmit: SubmitHandler<FormData> = (data) => onSubmitDraft(data);

  const watchcurrentResidence = watch("currentResidence");
  return (
    <ReviewFormLayout
      title={t("stayReview.estancia")}
      image={padlock}
      imageAlt="Padlock"
      commentTitle={t("stayReview.opinionAnonima")}
      comment={t("stayReview.informacionAnonima")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col">
          <label htmlFor="currentResidence">
            {t("stayReview.residesActualmente")}
          </label>
          <Controller
            name="currentResidence"
            control={control}
            render={({ field }) => (
              <RadioInput
                ariaInvalid={!!errors.currentResidence}
                {...field}
                options={[
                  { label: t("common.si"), value: true },
                  { label: t("common.no"), value: false },
                ]}
              />
            )}
          />

          {errors.currentResidence && (
            <FieldError>{errors.currentResidence.message}</FieldError>
          )}
        </div>
        {watchcurrentResidence !== undefined && (
          <div className="flex flex-col">
            <label>{t("stayReview.cuandoEmpezasteVivir")}</label>
            <div className="flex gap-3">
              <div className="w-full">
                <select
                  aria-invalid={!!errors.startMonth}
                  className="w-full"
                  {...register("startMonth")}
                >
                  <option value="">{t("common.mes")}</option>
                  {range(1, 12).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                {errors.startMonth && (
                  <FieldError>{errors.startMonth.message}</FieldError>
                )}
              </div>
              <div className="w-full">
                <select
                  aria-invalid={!!errors.startYear}
                  className="w-full"
                  {...register("startYear")}
                >
                  <option value="">{t("common.año")}</option>
                  {range(new Date().getFullYear(), 1980, -1).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.startYear && (
                  <FieldError>{errors.startYear.message}</FieldError>
                )}
              </div>
            </div>
          </div>
        )}
        {watchcurrentResidence?.valueOf() === false && (
          <div className="flex flex-col">
            <label>{t("stayReview.cuandoDejasteVivir")}</label>

            <div className="flex gap-3">
              <div className="w-full">
                <select
                  aria-invalid={!!errors.endMonth}
                  className="w-full"
                  {...register("endMonth")}
                >
                  <option value="">{t("common.mes")}</option>
                  {range(1, 12).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                {errors.endMonth && (
                  <FieldError>{errors.endMonth.message}</FieldError>
                )}
              </div>
              <div className="w-full">
                <select
                  aria-invalid={!!errors.endYear}
                  className="w-full"
                  {...register("endYear")}
                >
                  <option value="">{t("common.año")}</option>
                  {range(new Date().getFullYear(), 1980, -1).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.endYear && (
                  <FieldError>{errors.endYear.message}</FieldError>
                )}
              </div>
            </div>
          </div>
        )}

        {watchcurrentResidence !== undefined && (
          <div className="flex flex-col">
            <label htmlFor="startPrice">
              {t("stayReview.quePrecioTeniaEntrar")}
            </label>
            <input
              aria-invalid={!!errors.startPrice}
              type="number"
              className="w-full"
              placeholder={t("stayReview.precioVivienda")}
              {...register("startPrice")}
            />
            {errors.startPrice && (
              <FieldError>{errors.startPrice.message}</FieldError>
            )}
          </div>
        )}

        {watchcurrentResidence === false && (
          <div className="flex flex-col">
            <label htmlFor="end_price">
              {t("stayReview.quePrecioTeniaSalir")}
            </label>
            <input
              aria-invalid={!!errors.endPrice}
              type="number"
              className="w-full"
              placeholder={t("stayReview.precioVivienda")}
              {...register("endPrice")}
            />
            {errors.endPrice && (
              <FieldError>{errors.endPrice.message}</FieldError>
            )}
          </div>
        )}
        {watchcurrentResidence !== undefined && (
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
        )}
      </form>
    </ReviewFormLayout>
  );
};
