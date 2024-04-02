"use client";
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
import { useRouter } from "next/navigation";
import { useStep } from "@/hooks/useStep";
import { useTranslations } from "next-intl";
import { getUrlReview } from "@/helpers/stepper";
import { reviewConfigParams } from "@/staticData";
import TextAreaWithCharCounter from "../molecules/TexareaCounter";
import { useSubmitDraft } from "@/hooks/useSubmitDraft";
import { useDraft } from "@/hooks/swr/useDraft";

const schema = yup.object({
  buildingNeighborhood: yup.array(),
  touristicApartments: yup.string(),
  neighborsRelationship: yup.string(),
  buildingMaintenance: yup.string(),
  buildingCleaning: yup.string(),
  services: yup.array(),
  comment: yup.string().nullable(),
});

export const CommunityForm = () => {
  const { draft } = useDraft();
  const { onSubmitDraft } = useSubmitDraft("community");
  const router = useRouter();
  const { nextStepReview } = useStep();
  const t = useTranslations();
  const config = useTranslations("config");

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
  }, [isSubmitSuccessful, nextStepReview, router]);

  /* useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [isDirty]); */

  useEffect(() => {
    if (draft) reset(draft.data.community);
  }, [reset, draft, draft?.data.community]);

  type FormData = yup.InferType<typeof schema>;

  const onSubmit: SubmitHandler<FormData> = (data) => onSubmitDraft(data);

  return (
    <ReviewFormLayout title={t("communityReviews.comunidadVecinos")}>
      {
        /* config && */ <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="currentResidence">
                {t("communityReviews.comoDefiniriasEscalera")}
              </label>{" "}
              <span className="text-gray-500 text-sm text-right">
                {t("communityReviews.eligeTantasComoQuieras")}
              </span>
            </div>
            <Controller
              name="buildingNeighborhood"
              control={control}
              render={({ field }) => (
                <MultiselectInput
                  ariaInvalid={!!errors.buildingNeighborhood}
                  {...field}
                  options={reviewConfigParams.neighbors.buildingNeighborhood.map(
                    (e) => {
                      return {
                        label: config(`neighbors.buildingNeighborhood.${e}`),
                        value: e,
                      };
                    }
                  )}
                />
              )}
            />
            {errors.buildingNeighborhood && (
              <FieldError>{errors.buildingNeighborhood.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="touristicApartments">
                {t("common.pisosTuristicos")}
              </label>
              <span className="text-gray-500 text-sm">
                {t("common.opcional")}
              </span>
            </div>
            <Controller
              name="touristicApartments"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.touristicApartments}
                  {...field}
                  options={reviewConfigParams.neighbors.touristicApartments.map(
                    (e) => {
                      return {
                        label: config(`neighbors.touristicApartments.${e}`),
                        value: e,
                      };
                    }
                  )}
                />
              )}
            />
            {errors.touristicApartments && (
              <FieldError>{errors.touristicApartments.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="neighborsRelationship">
                {t("communityReviews.relacionVecinal")}
              </label>
              <span className="text-gray-500 text-sm">
                {t("common.opcional")}
              </span>
            </div>
            <Controller
              name="neighborsRelationship"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.neighborsRelationship}
                  {...field}
                  options={reviewConfigParams.neighbors.neighborsRelationship.map(
                    (e) => {
                      return {
                        label: config(`neighbors.neighborsRelationship.${e}`),
                        value: e,
                      };
                    }
                  )}
                />
              )}
            />
            {errors.neighborsRelationship && (
              <FieldError>{errors.neighborsRelationship.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="buildingMaintenance">
                {t("communityReviews.esadoEdificio")}
              </label>
              <span className="text-gray-500 text-sm">
                {t("common.opcional")}
              </span>
            </div>
            <Controller
              name="buildingMaintenance"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.buildingMaintenance}
                  {...field}
                  options={reviewConfigParams.neighbors.buildingMaintenance.map(
                    (e) => {
                      return {
                        label: config(`neighbors.buildingMaintenance.${e}`),
                        value: e,
                      };
                    }
                  )}
                />
              )}
            />
            {errors.buildingMaintenance && (
              <FieldError>{errors.buildingMaintenance.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="buildingCleaning">{t("common.limpieza")}</label>
              <span className="text-gray-500 text-sm">
                {t("common.opcional")}
              </span>
            </div>
            <Controller
              name="buildingCleaning"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.buildingCleaning}
                  {...field}
                  options={reviewConfigParams.neighbors.buildingCleaning.map(
                    (e) => {
                      return {
                        label: config(`neighbors.buildingCleaning.${e}`),
                        value: e,
                      };
                    }
                  )}
                />
              )}
            />
            {errors.buildingCleaning && (
              <FieldError>{errors.buildingCleaning.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="currentResidence">{t("common.services")}</label>{" "}
              <span className="text-gray-500 text-sm">
                {t("communityReviews.eligeTantasComoQuieras")}
              </span>
            </div>
            <Controller
              name="services"
              control={control}
              render={({ field }) => (
                <MultiselectInput
                  ariaInvalid={!!errors.services}
                  {...field}
                  options={reviewConfigParams.neighbors.services.map((e) => {
                    return {
                      label: config(`neighbors.services.${e}`),
                      value: e,
                    };
                  })}
                />
              )}
            />
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
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <TextAreaWithCharCounter
                  {...field}
                  ariaInvalid={!!errors.comment}
                  className="w-full h-32"
                  placeholder={t("communityReviews.añadirAlgunComentarioMas")}
                  name="comment"
                  control={control}
                />
              )}
            />
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
      }
    </ReviewFormLayout>
  );
};
