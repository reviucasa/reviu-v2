"use client";
import { FieldError } from "@/components/atoms/FieldError";
import { ReviewFormLayout } from "@/components/layouts/ReviewFormLayout";
import { RadioInput } from "@/components/molecules/RadioInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import * as yup from "yup";
import { Back } from "../atoms/Back";
import { Button } from "../atoms/Button";
import { HowDialog } from "../dialogs/HowDialog";
import { MultiselectInput } from "../molecules/MultiselectInput";
import { useRouter } from "@/navigation";
import { useStep } from "@/hooks/useStep";
import { useTranslations } from "next-intl";
import { getUrlReview } from "@/helpers/stepper";
import { useDraft } from "@/hooks/swr/useDraft";
import { useSubmitDraft } from "@/hooks/useSubmitDraft";
import { reviewConfigParams } from "@/staticData";
import TextAreaWithCharCounter from "../molecules/TexareaCounter";

export const NeighbourhoodForm = () => {
  const [vibeOpen, setVibeOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const router = useRouter();
  const { nextStepReview } = useStep();
  const { draft, refreshDraft } = useDraft();
  const { onSubmitDraft } = useSubmitDraft("neighbourhood");
  const t = useTranslations();
  const config = useTranslations("config");

  const schema = yup.object({
    vibe: yup
      .array()
      .required(t("common.alMenosUnaOpcion"))
      .test("minLenght", t("common.alMenosUnaOpcion"), (val) =>
        val?.length ? val?.length > 0 : false
      ),
    tourists: yup.string().required(t("common.seleccionaOpcion")),
    noise: yup.string().required(t("common.seleccionaOpcion")),
    security: yup.string().required(t("common.seleccionaOpcion")),
    cleaning: yup.string().required(t("common.seleccionaOpcion")),
    services: yup
      .array()
      .required(t("common.alMenosUnaOpcion"))
      .test("minLenght", t("common.alMenosUnaOpcion"), (val) =>
        val?.length ? val?.length > 0 : false
      ),
    comments: yup.string().nullable(),
  });

  const vibeValues = [
    {
      title: t("common.Tranquilo"),
      description: t("common.bajosNivelesRuido"),
    },
    {
      title: t("common.Lúdico/Festivo"),
      description: t("common.ambienteActivo"),
    },
    {
      title: t("common.Familiar"),
      description: t("common.ambienteAmigable"),
    },
    {
      title: t("common.Estudiantil"),
      description: t("common.centrosEducativos"),
    },
    {
      title: t("common.Nocturno"),
      description: t("common.zonaActiva"),
    },
  ];

  const securityValues = [
    {
      title: t("common.muySegura"),
      description: t("common.sinAltercados"),
    },
    {
      title: t("common.mejorable"),
      description: t("common.algunAltercado"),
    },
    {
      title: t("common.sinProblemas"),
      description: t("common.altercadosOcasionales"),
    },
    {
      title: t("common.pocoSegura"),
      description: t("common.inseguro"),
    },
  ];

  const {
    formState: { isDirty, isValid, errors, isSubmitSuccessful },
    handleSubmit,
    control,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
    defaultValues: draft?.data.neighbourhood,
  });
  const isFormCompleted = isValid && !isDirty;

  useEffect(() => {
    if (isSubmitSuccessful) {
      refreshDraft();
      router.push(getUrlReview(nextStepReview));
    }
  }, [isSubmitSuccessful, nextStepReview, refreshDraft, router]);

  useEffect(() => {
    reset(draft?.data.neighbourhood);
  }, [draft?.data.neighbourhood, reset]);

  type FormData = yup.InferType<typeof schema>;

  const onSubmit: SubmitHandler<FormData> = (data) => onSubmitDraft(data);

  return (
    <ReviewFormLayout title={t("common.barrio")}>
      {
        /* config &&  */ <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="vibe">
                {t("common.ambience")}
                <AiOutlineInfoCircle
                  className="cursor-pointer"
                  onClick={() => {
                    setVibeOpen(true);
                  }}
                />
              </label>
              <span className="text-gray-500 text-sm">
                {t("neighbourhoodReview.unaOpcion")}
              </span>
            </div>
            <Controller
              name="vibe"
              control={control}
              render={({ field }) => (
                <MultiselectInput
                  ariaInvalid={!!errors.vibe}
                  {...field}
                  options={reviewConfigParams.neighbourhood.vibe.map((e) => {
                    return {
                      label: config(`neighbourhood.vibe.${e}`),
                      value: e,
                    };
                  })}
                />
              )}
            />
            {errors.vibe && <FieldError>{errors.vibe.message}</FieldError>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="tourists">{t("common.turistas")}</label>
            <Controller
              name="tourists"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.tourists}
                  {...field}
                  options={reviewConfigParams.neighbourhood.tourists.map(
                    (e) => {
                      return {
                        label: config(`neighbourhood.tourists.${e}`),
                        value: e,
                      };
                    }
                  )}
                />
              )}
            />
            {errors.tourists && (
              <FieldError>{errors.tourists.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="noise">{t("common.ruido")}</label>
            <Controller
              name="noise"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.noise}
                  {...field}
                  options={reviewConfigParams.neighbourhood.noise.map((e) => {
                    return {
                      label: config(`neighbourhood.noise.${e}`),
                      value: e,
                    };
                  })}
                />
              )}
            />
            {errors.noise && <FieldError>{errors.noise.message}</FieldError>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="security">
              {t("common.seguridad")}
              <AiOutlineInfoCircle
                className="cursor-pointer"
                onClick={() => {
                  setSecurityOpen(true);
                }}
              />
            </label>
            <Controller
              name="security"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.security}
                  {...field}
                  options={reviewConfigParams.neighbourhood.security.map(
                    (e) => {
                      return {
                        label: config(`neighbourhood.security.${e}`),
                        value: e,
                      };
                    }
                  )}
                />
              )}
            />
            {errors.security && (
              <FieldError>{errors.security.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="currentResidence">{t("common.limpieza")}</label>
            <Controller
              name="cleaning"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.cleaning}
                  {...field}
                  options={reviewConfigParams.neighbourhood.cleaning.map(
                    (e) => {
                      return {
                        label: config(`neighbourhood.cleaning.${e}`),
                        value: e,
                      };
                    }
                  )}
                />
              )}
            />
            {errors.cleaning && (
              <FieldError>{errors.cleaning.message}</FieldError>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="currentResidence">
                {t("neighbourhoodReview.serviciosProximos")}
              </label>
              <span className="text-gray-500 text-sm">
                {t("neighbourhoodReview.unaOpcion")}
              </span>
            </div>
            <Controller
              name="services"
              control={control}
              render={({ field }) => (
                <MultiselectInput
                  {...field}
                  options={reviewConfigParams.neighbourhood.services.map(
                    (e) => {
                      return {
                        label: config(`neighbourhood.services.${e}`),
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
          <div className="flex flex-col">
            <div className="flex justify-between">
              <p /* htmlFor="comments" */>{t("common.añadirComentario")}</p>
              <span className="text-gray-500 text-sm">
                {t("common.opcional")}
              </span>
            </div>
            <Controller
              name="comments"
              control={control}
              render={({ field }) => (
                <TextAreaWithCharCounter
                  {...field}
                  ariaInvalid={!!errors.comments}
                  className="w-full h-32"
                  placeholder={t("neighbourhoodReview.algunComentarioAñadir")}
                  name="comments"
                  control={control}
                />
              )}
            />
            {errors.comments && (
              <FieldError>{errors.comments.message}</FieldError>
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
        </form>
      }
      <HowDialog
        isOpen={vibeOpen}
        setIsOpen={setVibeOpen}
        values={vibeValues}
        title={t("neighbourhoodReview.comoValorasAmbiente")}
      />
      <HowDialog
        isOpen={securityOpen}
        setIsOpen={setSecurityOpen}
        values={securityValues}
        title={t("neighbourhoodReview.comoValorasSeguridad")}
      />
    </ReviewFormLayout>
  );
};
