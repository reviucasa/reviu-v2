"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import smileHouse from "public/images/smile_house.png";
import { useEffect, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import * as yup from "yup";
import { Back } from "../atoms/Back";
import { Button } from "../atoms/Button";
import { FieldError } from "../atoms/FieldError";
import { ReviewFormLayout } from "../layouts/ReviewFormLayout";
import { RadioInput } from "../molecules/RadioInput";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { useDraft } from "@/hooks/swr/useDraft";
import { useSubmitDraft } from "@/hooks/useSubmitDraft";
import TextAreaWithCharCounter from "../molecules/TexareaCounter";
import { PiImage } from "react-icons/pi";
import Image from "next/image";
import {
  Opinion,
  ReviewImage,
  ReviewStatus,
  deleteDraft,
  getDraft,
  publishReview,
} from "@/models/review";
import { auth } from "@/firebase/config";
import { uploadImage } from "@/firebase/helpers";
import { resizeImage } from "@/helpers/resizeImage";
import { BiTrash, BiX } from "react-icons/bi";

export const OpinionForm = () => {
  const { draft } = useDraft();
  const { onSubmitDraft } = useSubmitDraft("opinion");
  const router = useRouter();
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    title: yup.string().required(t("common.tituloRequerido")),
    positive: yup.string().required(t("common.tuValoracionPositiva")),
    negative: yup.string().required(t("common.tuValoracionNegativa")),
    images: yup
      .array()
      .of(
        yup.object({
          url: yup.mixed(),
          caption: yup.string(),
        })
      )
      .nullable(),
    recomend: yup.boolean().required(t("common.recomendariasVivienda")),
  });

  type FormData = yup.InferType<typeof schema>;

  const {
    formState: { errors },
    control,
    setError,
    clearErrors,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
    defaultValues: draft?.data.opinion,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images", // The key of the field array in your form
  });

  useEffect(() => {
    reset(draft?.data.opinion);
  }, [draft?.data.opinion, reset]);

  async function uploadImagesAndPrepareData(data: any): Promise<Opinion> {
    let images: ReviewImage[] = [];
    if (data.images) {
      const imageDataPromises = data.images.map(async (image: ReviewImage) => {
        if (!image.url.includes("https://")) {
          try {
            const file = await resizeImage(image.url);
            const url = await uploadImage(
              file,
              `reviews/${auth.currentUser!.uid}/${Date.now()}`
            );
            return {
              url,
              caption: image.caption,
            } as ReviewImage;
          } catch (error) {
            console.log(error);
          }
        } else {
          return image;
        }
      });

      images = await Promise.all(imageDataPromises);
    }

    const opinionData: Opinion = {
      title: data.title,
      positive: data.positive,
      negative: data.negative,
      recomend: data.recomend,
      images,
    };

    // Submit opinionData or use as needed
    return opinionData;
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      const opinionData = await uploadImagesAndPrepareData(data);
      await onSubmitDraft(opinionData);
      let finalDraft = await getDraft(auth.currentUser?.uid!);

      await publishReview(auth.currentUser!.uid, {
        ...finalDraft!,
        status: ReviewStatus.Published,
      });
      router.push("/success");
      deleteDraft(auth.currentUser!.uid);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <ReviewFormLayout
      title={t("opinionReview.opinionPiso")}
      image={smileHouse}
      imageAlt="Smile house"
      commentTitle={t("opinionReview.conciso")}
      comment={t("opinionReview.estaInformacion")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col">
          <label htmlFor="title">{t("opinionReview.resumeExperiencia")}</label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextAreaWithCharCounter
                {...field}
                maxLength={80}
                ariaInvalid={!!errors.positive}
                className="w-full h-20"
                placeholder={t("opinionReview.escribeSencillo")}
                name="title"
                control={control}
              />
            )}
          />
          {errors.title && <FieldError>{errors.title.message}</FieldError>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="positive">{t("opinionReview.valorPositivo")}</label>
          <Controller
            name="positive"
            control={control}
            render={({ field }) => (
              <TextAreaWithCharCounter
                {...field}
                ariaInvalid={!!errors.positive}
                className="w-full h-32"
                placeholder={t("opinionReview.cuentanosCosasBuenas")}
                name="positive"
                control={control}
              />
            )}
          />

          {errors.positive && (
            <FieldError>{errors.positive.message}</FieldError>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="negative">{t("opinionReview.valorNegativo")}</label>

          <Controller
            name="negative"
            control={control}
            render={({ field }) => (
              <TextAreaWithCharCounter
                {...field}
                ariaInvalid={!!errors.negative}
                className="w-full h-32"
                placeholder={t("opinionReview.cuentanosMejorias")}
                name="negative"
                control={control}
              />
            )}
          />
          {errors.negative && (
            <FieldError>{errors.negative.message}</FieldError>
          )}
        </div>
        {/* Images section */}
        <div className="">
          <label htmlFor="images">{t("opinionReview.añadeImágenes")}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 px-4 sm:px-0 lg:px-4 xl:px-0">
            {fields.map((field, index) => (
              <div key={field.id} className="text-center ">
                <div className="flex flex-col relative text-center gap-y-2">
                  <Controller
                    control={control}
                    name={`images.${index}.url`}
                    render={({ field: { onChange, value } }) =>
                      value != null || field.url != null ? (
                        <Image
                          id={`image-preview-${index}`}
                          src={field.url || value}
                          width={100}
                          height={100}
                          className="rounded-lg object-cover border border-dashed border-gray-400 w-auto h-48"
                          alt="selected image"
                        />
                      ) : (
                        <div className="rounded-lg border border-dashed border-gray-400 hover:border-secondary-500 px-6 py-12 h-48">
                          <PiImage
                            className="mx-auto h-6 w-6 text-gray-300"
                            aria-hidden="true"
                          />

                          <div className=" text-sm text-gray-600">
                            <label
                              htmlFor={`images.${index}.image`}
                              className="cursor-pointer font-semibold text-primary-300 focus-within:outline-none focus-within:ring-0 hover:text-primary-500"
                            >
                              <p className="mt-4 w-full">
                                {t("opinionReview.subeArchivo")}
                              </p>
                              <input
                                id={`images.${index}.image`}
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    clearErrors(`images.${index}.url`);
                                    const reader = new FileReader();
                                    if (file) {
                                      reader.onload = async (e: Event) => {
                                        if (reader.result) {
                                          onChange(reader.result);

                                          const target = e.target as FileReader;

                                          const previewElement =
                                            document.getElementById(
                                              `image-preview-${index}`
                                            ) as HTMLImageElement;
                                          if (previewElement) {
                                            previewElement.src =
                                              reader.result as string;
                                          }
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }
                                }}
                              />
                            </label>
                          </div>
                          <p className="text-xs leading-5 text-gray-600">
                            {t("opinionReview.specsArchivos")}
                          </p>
                        </div>
                      )
                    }
                  />
                  <Controller
                    control={control}
                    name={`images.${index}.caption`}
                    render={({ field: { onChange, value } }) => (
                      <input
                        {...field}
                        placeholder={t("opinionReview.descripciónImágen")}
                        value={value}
                        className=" h-10"
                        maxLength={80}
                        onChange={onChange}
                      />
                    )}
                  />
                  <BiX
                    color="gray"
                    className="absolute top-2 right-2 w-6 h-6 cursor-pointer p-1 rounded-md bg-white"
                    onClick={() => remove(index)}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className={`btn-terciary-500 w-40 ${
              fields.length == 0 ? " mt-2" : "mt-8"
            }`}
            onClick={() => append({ url: null, caption: "" })}
          >
            {t("opinionReview.añadirImágen")}
          </button>
        </div>
        <div className="flex flex-col">
          <label htmlFor="recomend">{t("opinionReview.recomendarias")}</label>
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
          <Button buttonClassName={"btn-secondary-500"} loading={loading}>
            {t("common.publicar")}
          </Button>
        </div>
      </form>
    </ReviewFormLayout>
  );
};
