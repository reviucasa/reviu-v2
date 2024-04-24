"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "../atoms/Button";
import { FieldError } from "../atoms/FieldError";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import TextAreaWithCharCounter from "../molecules/TexareaCounter";
import { PiImage } from "react-icons/pi";
import Image from "next/image";
import { Opinion, ReviewImage } from "@/models/review";
import { auth } from "@/firebase/config";
import { uploadImage } from "@/firebase/helpers";
import { resizeImage } from "@/helpers/resizeImage";
import { Post, PostStatus, createPost } from "@/models/post";
import { normalizeString } from "@/helpers/normalizeString";

export const PostForm = () => {
  const router = useRouter();
  const t = useTranslations();

  const schema = yup.object({
    title: yup.string().required("Required"),
    subtitle: yup.string().required("Required"),
    image: yup.string().required("Required"),
    content: yup.string().required("Required"),
  });

  type FormData = yup.InferType<typeof schema>;

  const {
    formState: { errors },
    control,
    clearErrors,
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const { title, subtitle, image, content } = data;
      let url = "";
      if (image) {
        const file = await resizeImage(image);
        url = await uploadImage(
          file,
          `posts/${normalizeString(title.toLowerCase().replaceAll(" ", "-"))}`
        );
      }

      const post: Partial<Post> = {
        title,
        subtitle,
        imageUrl: url,
        content: content.replace(/\n/g, "<br>"),
        status: PostStatus.active,
      };

      // TODO: await create/update post;
      await createPost(post);

      router.push("/admin/blog"); // /admin/blog/postId
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 mx-auto px-4 md:w-3/4 xl:w-3/5"
    >
      <h1 className="text-xl font-semibold leading-6 text-gray-900">
        Write a new Post
      </h1>
      <div className="flex flex-col">
        <label htmlFor="title">A cool and catchy title</label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextAreaWithCharCounter
              {...field}
              maxLength={80}
              ariaInvalid={!!errors.title}
              className="w-full h-14"
              placeholder="My new post title"
              name="title"
              control={control}
            />
          )}
        />
        {errors.title && <FieldError>{errors.title.message}</FieldError>}
      </div>
      <div className="flex flex-col">
        <label htmlFor="subtitle">Post subtitle</label>
        <Controller
          name="subtitle"
          control={control}
          render={({ field }) => (
            <TextAreaWithCharCounter
              {...field}
              ariaInvalid={!!errors.subtitle}
              className="w-full h-20"
              placeholder="Something catchy that engages the reader"
              name="subtitle"
              control={control}
            />
          )}
        />

        {errors.subtitle && <FieldError>{errors.subtitle.message}</FieldError>}
      </div>
      <div>
        <p className=" font-bold pb-2">Main image</p>
        <Controller
          control={control}
          name="image"
          render={({ field: { onChange, value } }) =>
            value != null ? (
              <Image
                id="image"
                src={value}
                width={400}
                height={400}
                className="rounded-lg object-cover border border-dashed border-gray-400 w-full h-auto aspect-video max-w-[500px]"
                alt="selected image"
              />
            ) : (
              <div className="rounded-lg text-center border border-dashed border-gray-400 hover:border-secondary-500 px-6 py-24 w-full h-auto aspect-video max-w-[500px]">
                <PiImage
                  className="mx-auto h-6 w-6 text-gray-300"
                  aria-hidden="true"
                />

                <div className="text-sm text-gray-600">
                  <label
                    htmlFor="image"
                    className="cursor-pointer font-semibold text-primary-300 focus-within:outline-none focus-within:ring-0 hover:text-primary-500"
                  >
                    <p className="mt-4 w-full">Select file</p>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          clearErrors("image");
                          const reader = new FileReader();
                          if (file) {
                            reader.onload = async (e: Event) => {
                              if (reader.result) {
                                onChange(reader.result);

                                const target = e.target as FileReader;

                                const previewElement = document.getElementById(
                                  "image"
                                ) as HTMLImageElement;
                                if (previewElement) {
                                  previewElement.src = reader.result as string;
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
                  PNG o JPG up to 5MB
                </p>
              </div>
            )
          }
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="content">Content</label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TextAreaWithCharCounter
              {...field}
              ariaInvalid={!!errors.subtitle}
              maxLength={3000}
              className="w-full h-64"
              placeholder="The content of your post goes here"
              name="content"
              control={control}
            />
          )}
        />

        {errors.subtitle && <FieldError>{errors.subtitle.message}</FieldError>}
      </div>
      <div className="flex justify-between">
        <Button buttonClassName={"btn-secondary-500"}>Publish</Button>
      </div>
    </form>
  );
};
