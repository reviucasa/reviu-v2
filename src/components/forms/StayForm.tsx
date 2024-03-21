import { FieldError } from "@/components/atoms/FieldError";
import { ReviewFormLayout } from "@/components/layouts/ReviewFormLayout";
import { RadioInput } from "@/components/molecules/RadioInput";
import { yupResolver } from "@hookform/resolvers/yup";
import padlock from "public/padlock.png";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { MdDone } from "react-icons/md";
import * as yup from "yup";
import { Back } from "../atoms/Back";
import { Button } from "../atoms/Button";
import { useReview } from "@/hooks/swr/useReview";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import { useRouter } from "next/navigation";
import { useStep } from "@/hooks/useStep";
import { useTranslations } from "next-intl";
import { getUrlReview } from "@/helpers/stepper";
import { range } from "@/helpers/generateRange";

export const StayForm = () => {
  const { review } = useReview();
  const { onSubmitReview } = useSubmitReview("stay");
  const router = useRouter();
  const { nextStepReview } = useStep();
  const t = useTranslations();

  const schema = yup.object({
    currentResidence: yup.boolean().required(),
    startMonth: yup.string() /* .when(["currentResidence"], {
      is: (currentResidence: boolean) => currentResidence === true,
      then: yup
        .string()
        .required(t("common.seleccionaMes")),
      otherwise: yup
        .string()
        .required(t("common.seleccionaMes"))
        .test(
          "validStartMonth",
          t(
            "common.mesInicio",
          ),
          function (value) {
            const { currentResidence, startYear } = this.parent;
            if (currentResidence === true && value) {
              const currentYear = new Date().getFullYear();
              const currentMonth = new Date().getMonth() + 1;
              const startYear = parseInt(startYear);
              const startMonth = parseInt(value);
              if (startYear > currentYear) {
                return false;
              }
              if (startYear === currentYear && startMonth > currentMonth) {
                return false;
              }
            }
            return true;
          }
        ),
    }) */,
    startYear: yup.string().required(t("common.seleccionaAño")),
    endYear: yup.string() /* .when(["currentResidence", "startYear"], {
      is: (currentResidence: boolean) => currentResidence === false,
      then: yup
        .string()
        .required(t("common.seleccionaAño", "Debes seleccionar un año"))
        .test(
          "validYear",
          t(
            "common.añoSalida",
            "El año de salida no puede ser anterior al año de inicio"
          ),
          function (value) {
            const { startYear } = this.parent;
            if (!startYear || !value) {
              return true;
            }
            const startYear = parseInt(startYear);
            const endYear = parseInt(value);
            return endYear >= startYear;
          }
        ),
    }) */,
    endMonth: yup.string(),
    /* .when(["currentResidence", "startYear", "startMonth"], {
        is: (currentResidence: boolean) => currentResidence === false,
        then: yup
          .string()
          .required(t("common.seleccionaMes", "Debes seleccionar un mes"))
          .test(
            "validEndMonth",
            t(
              "common.mesSalida",
              "El mes de salida no puede ser posterior al mes de inicio"
            ),
            function (value) {
              const { startYear, startMonth, endYear } = this.parent;
              if (!startYear || !startMonth || !value) {
                return true;
              }
              const startYear = parseInt(startYear);
              const endYear = parseInt(endYear);
              const startMonth = parseInt(startMonth);
              const endMonth = parseInt(value);
              if (startYear === endYear) {
                return endMonth >= startMonth;
              }
              return true;
            }
          ),
      }) */ startPrice: yup.string().required(t("common.seleccionaPrecio")),
    end_price: yup.string(),
    /* .when("currentResidence", (currentResidence, schema) => {
        return currentResidence === false
          ? schema.required(
              t("common.seleccionaPrecio")
            )
          : schema;
      }) */
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
    defaultValues: review?.data.stay,
  });

  const isFormCompleted = isValid && !isDirty;

  const handleRouteChange = () => {
    if (isDirty) {
      const resultado = confirm(t("common.withSaving"));
      if (!resultado) {
        /* router.events.emit("routeChangeError", "routeChange aborted", "", {
          shallow: false,
        }); */ //primer argumento NOMBRE del evento // segundo info ruta actual // tercero ruta destino
        throw "routeChange aborted.";
      }
    }
  };
  useEffect(() => {
    if (isSubmitSuccessful) router.push(getUrlReview(nextStepReview));
  }, [isSubmitSuccessful]);

  /* useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [isDirty]); */

  useEffect(() => {
    reset(review?.data.stay);
  }, [review?.data.stay]);

  type FormData = yup.InferType<typeof schema>;

  const onSubmit: SubmitHandler<FormData> = (data) => onSubmitReview(data);

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
                  {range(2023, 1980, -1).map((year) => (
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
                  {range(2023, 1980, -1).map((year) => (
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
              aria-invalid={!!errors.end_price}
              type="number"
              className="w-full"
              placeholder={t("stayReview.precioVivienda")}
              {...register("end_price")}
            />
            {errors.end_price && (
              <FieldError>{errors.end_price.message}</FieldError>
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
