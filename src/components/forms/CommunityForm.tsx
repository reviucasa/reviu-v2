import { FieldError } from "@/components/atoms/FieldError";
import { ReviewFormLayout } from "@/components/layouts/ReviewFormLayout";
import { RadioInput } from "@/components/molecules/RadioInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { Back } from "../atoms/Back";
import { Button } from "../atoms/Button";
import { MultiselectInput } from "../molecules/MultiselectInput";
import { useReview } from "@/hooks/swr/useReview";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import { useConfig } from "@/hooks/swr/useConfig";
import { useRouter } from "next/navigation";
import { useStep } from "@/hooks/useStep";
import { useTranslations } from "next-intl";
import { getUrlReview } from "@/helpers/stepper";

const schema = yup.object({
  building_neighborhood: yup.array(),
  touristic_apartments: yup.string(),
  neighbors_relationship: yup.string(),
  building_maintenance: yup.string(),
  building_cleaning: yup.string(),
  services: yup.array(),
  comment: yup.string().nullable(),
});

export const CommunityForm = () => {
  const { review } = useReview();
  const { onSubmitReview } = useSubmitReview("community");
  const { config } = useConfig();
  const router = useRouter();
  const { nextStepReview } = useStep();
  const t = useTranslations();

  const {
    formState: { isDirty, isValid, errors, isSubmitSuccessful },
    handleSubmit,
    control,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  const isFormCompleted = isValid && !isDirty;

  const handleRouteChange = () => {
    if (isDirty) {
      const resultado = confirm(t("common.withSaving"));
      /* if (!resultado) {
        router.events.emit("routeChangeError", "routeChange aborted", "", {
          shallow: false,
        }); //primer argumento NOMBRE del evento // segundo info ruta actual // tercero ruta destino
        throw "routeChange aborted.";
      } */
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
    if (review) reset(review.review.community);
  }, [review?.review.community]);

  type FormData = yup.InferType<typeof schema>;

  const onSubmit: SubmitHandler<FormData> = (data) => onSubmitReview(data);

  return (
    <ReviewFormLayout title={t("communityReviews.comunidadVecinos")}>
      {config && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="currentResidence">
                {t("communityReviews.comoDefiniriasEscalera")}
              </label>{" "}
              <span className="text-gray-500 text-sm text-right">
                {t("communityReviews.eligeTantasComoQuieras")}
              </span>
            </div>
            {/* <Controller
              name="building_neighborhood"
              control={control}
              render={({ field }) => (
                <MultiselectInput
                  ariaInvalid={!!errors.building_neighborhood}
                  {...field}
                  options={config?.neighbors.building_neighborhood}
                />
              )}
            /> */}
            {errors.building_neighborhood && (
              <FieldError>{errors.building_neighborhood.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="touristic_apartments">
                {t("common.pisosTuristicos")}
              </label>
              <span className="text-gray-500 text-sm">
                {t("common.opcional")}
              </span>
            </div>
            {/* <Controller
              name="touristic_apartments"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.touristic_apartments}
                  {...field}
                  options={config.neighbors.touristic_apartments}
                />
              )}
            /> */}
            {errors.touristic_apartments && (
              <FieldError>{errors.touristic_apartments.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="neighbors_relationship">
                {t("communityReviews.relacionVecinal")}
              </label>
              <span className="text-gray-500 text-sm">
                {t("common.opcional")}
              </span>
            </div>
            {/* <Controller
              name="neighbors_relationship"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.neighbors_relationship}
                  {...field}
                  options={config.neighbors.neighbors_relationship}
                />
              )}
            /> */}
            {errors.neighbors_relationship && (
              <FieldError>{errors.neighbors_relationship.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="building_maintenance">
                {t("communityReviews.esadoEdificio")}
              </label>
              <span className="text-gray-500 text-sm">
                {t("common.opcional")}
              </span>
            </div>
            {/* <Controller
              name="building_maintenance"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.building_maintenance}
                  {...field}
                  options={config.neighbors.building_maintenance}
                />
              )}
            /> */}
            {errors.building_maintenance && (
              <FieldError>{errors.building_maintenance.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="building_cleaning">{t("common.limpieza")}</label>
              <span className="text-gray-500 text-sm">
                {t("common.opcional")}
              </span>
            </div>
            {/* <Controller
              name="building_cleaning"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.building_cleaning}
                  {...field}
                  options={config.neighbors.building_cleaning}
                />
              )}
            /> */}
            {errors.building_cleaning && (
              <FieldError>{errors.building_cleaning.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="currentResidence">{t("common.services")}</label>{" "}
              <span className="text-gray-500 text-sm">
                {t("communityReviews.eligeTantasComoQuieras")}
              </span>
            </div>
            {/* <Controller
              name="services"
              control={control}
              render={({ field }) => (
                <MultiselectInput
                  ariaInvalid={!!errors.services}
                  {...field}
                  options={config.neighbors.services}
                />
              )}
            /> */}
            {errors.services && (
              <FieldError>{errors.services.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="comment">
                {t("communityReviews.añadirComentario")}
              </label>
              <span className="text-gray-500 text-sm">
                {t("common.opcional")}
              </span>
            </div>
            {/* <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <TextAreaWithCharCounter
                  {...field}
                  ariaInvalid={!!errors.comment}
                  className="w-full h-32"
                  placeholder={t(
                    "communityReviews.añadirAlgunComentarioMas",
                    "Añade algún comentario más que quieras aportar"
                  )}
                  name="comment"
                  control={control}
                />
              )}
            /> */}
            {errors.comment && (
              <FieldError>{errors.comment.message}</FieldError>
            )}
          </div>

          <div className="flex justify-between ">
            <div className="flex items-center">
              <Back className="lg:hidden" />
            </div>
            <div className="flex gap-2">
              <Button
                buttonClassName={"btn-terciary-500"}
                onClick={() => {
                  router.push(getUrlReview(nextStepReview));
                }}
              >
                {t("common.skip")}
              </Button>
              <Button buttonClassName={"btn-primary-500"}>
                {t("common.guardar")}
              </Button>
            </div>
          </div>
        </form>
      )}
    </ReviewFormLayout>
  );
};
