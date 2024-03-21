import { yupResolver } from "@hookform/resolvers/yup";
import smileHouse from "public/smile_house.png";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { Back } from "../atoms/Back";
import { Button } from "../atoms/Button";
import { FieldError } from "../atoms/FieldError";
import { ReviewFormLayout } from "../layouts/ReviewFormLayout";
import { RadioInput } from "../molecules/RadioInput";
import { useReview } from "@/hooks/swr/useReview";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import { useRouter } from "next/navigation";
import { useStep } from "@/hooks/useStep";
import { useTranslations } from "next-intl";

export const OpinionForm = () => {
  const { review /* , updateReview */ } = useReview();
  const { onSubmitReview } = useSubmitReview("opinion");
  const router = useRouter();
  const { nextStepReview } = useStep();
  const t = useTranslations();

  const schema = yup.object({
    title: yup.string().required(t("common.tituloRequerido")),
    positive: yup.string().required(t("common.tuValoracionPositiva")),
    negative: yup.string().required(t("common.tuValoracionNegativa")),
    recomend: yup.boolean().required(t("common.recomendariasVivienda")),
  });
  type FormData = yup.InferType<typeof schema>;
  const {
    formState: { isDirty, isValid, errors, isSubmitSuccessful },
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
    defaultValues: review?.data.opinion,
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

  /* useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [isDirty]); */

  useEffect(() => {
    reset(review?.data.opinion);
  }, [review?.data.opinion]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await onSubmitReview(data);
    /* await updateReview({ draft: false }); */
    router.push("/success");
  };

  return (
    <ReviewFormLayout
      title={t("opinionReview.opinionPiso")}
      image={smileHouse}
      imageAlt="Smile house"
      commentTitle={t("opinionReview:conciso")}
      comment={t("opinionReview:estaInformacion")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col">
          <label htmlFor="title">{t("opinionReview:resumeExperiencia")}</label>
          {/* <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextAreaWithCharCounter
                {...field}
                maxLength={80}
                ariaInvalid={!!errors.positive}
                className="w-full h-20"
                placeholder={t(
                  "opinionReview:escribeSencillo",
                )}
                name="title"
                control={control}
              />
            )}
          /> */}
          {errors.title && <FieldError>{errors.title.message}</FieldError>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="positive">{t("opinionReview:valorPositivo")}</label>
          {/* <Controller
            name="positive"
            control={control}
            render={({ field }) => (
              <TextAreaWithCharCounter
                {...field}
                ariaInvalid={!!errors.positive}
                className="w-full h-32"
                placeholder={t(
                  "opinionReview:cuentanosCosasBuenas",
                  "Cuéntanos las cosas buenas que tiene la vivienda"
                )}
                name="positive"
                control={control}
              />
            )}
          /> */}

          {errors.positive && (
            <FieldError>{errors.positive.message}</FieldError>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="negative">{t("opinionReview:valorNegativo")}</label>

          {/* <Controller
            name="negative"
            control={control}
            render={({ field }) => (
              <TextAreaWithCharCounter
                {...field}
                ariaInvalid={!!errors.negative}
                className="w-full h-32"
                placeholder={t(
                  "opinionReview:cuentanosMejorias",
                  "Cuéntanos las cosas que mejorarías de la vivienda"
                )}
                name="negative"
                control={control}
              />
            )}
          /> */}
          {errors.negative && (
            <FieldError>{errors.negative.message}</FieldError>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="recomend">{t("opinionReview:recomendarias")}</label>
          <Controller
            name="recomend"
            control={control}
            render={({ field }) => (
              <RadioInput
                ariaInvalid={!!errors.recomend}
                {...field}
                options={[
                  { label: t("common.si"), value: true },
                  { label: t("common.no"), value: false },
                ]}
              />
            )}
          />

          {errors.recomend && (
            <FieldError>{errors.recomend.message}</FieldError>
          )}
        </div>

        <div className="flex justify-between">
          <div>
            <Back className="lg:hidden" />
          </div>
          <Button buttonClassName={"btn-secondary-500"}>
            {t("common.publicar")}
          </Button>
        </div>
      </form>
    </ReviewFormLayout>
  );
};
