"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "../atoms/Button";
import { FieldError } from "../atoms/FieldError";
import { useRouter } from "@/navigation";
import TextAreaWithCharCounter from "../molecules/TexareaCounter";
import { PiImage } from "react-icons/pi";
import Image from "next/image";
import { uploadImage } from "@/firebase/helpers";
import { resizeImage } from "@/helpers/resizeImage";
import { Post, PostStatus, createPost } from "@/models/post";
import { normalizeString } from "@/helpers/normalizeString";
import ReactQuillEditor from "../molecules/ReactQuillEditor";

export const PostForm = () => {
  const router = useRouter();

  const schema = yup.object({
    catitle: yup.string().required("Required"),
    estitle: yup.string().required("Required"),
    entitle: yup.string().required("Required"),
    casubtitle: yup.string().required("Required"),
    essubtitle: yup.string().required("Required"),
    ensubtitle: yup.string().required("Required"),
    image: yup.string().required("Required"),
    cacontent: yup.string().required("Required"),
    escontent: yup.string().required("Required"),
    encontent: yup.string().required("Required"),
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
      const {
        catitle,
        estitle,
        entitle,
        casubtitle,
        essubtitle,
        ensubtitle,
        image,
        cacontent,
        escontent,
        encontent,
      } = data;
      let url = "";
      if (image) {
        const file = await resizeImage(image);
        url = await uploadImage(
          file,
          `posts/${normalizeString(entitle.toLowerCase().replaceAll(" ", "-"))}`
        );
      }

      const post: Partial<Post> = {
        translations: {
          ca: {
            title: catitle,
            subtitle: casubtitle,
            content: cacontent,
          },
          es: {
            title: estitle,
            subtitle: essubtitle,
            content: escontent,
          },
          en: {
            title: entitle,
            subtitle: ensubtitle,
            content: encontent,
          },
        },
        imageUrl: url,
        status: PostStatus.active,
      };

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
        {[
          {
            controller: "catitle",
            error: errors.catitle,
            placeholder: "Català: Escriu aquí el títol",
          },
          {
            controller: "estitle",
            error: errors.estitle,
            placeholder: "Castellano: Escribe aquí el subtítulo",
          },
          {
            controller: "entitle",
            error: errors.entitle,
            placeholder: "English: Write here the title",
          },
        ].map((e) => (
          <div key={e.controller}>
            <Controller
              name={e.controller as "catitle" | "estitle" | "entitle"}
              control={control}
              render={({ field }) => (
                <TextAreaWithCharCounter
                  {...field}
                  maxLength={80}
                  ariaInvalid={!!e.error}
                  className="w-full h-14 mb-2"
                  placeholder={e.placeholder}
                  name={e.controller}
                  control={control}
                />
              )}
            />
            {e.error && <FieldError>{e.error.message}</FieldError>}
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <label htmlFor="subtitle">Post subtitle</label>
        {[
          {
            controller: "casubtitle",
            error: errors.casubtitle,
            placeholder: "Català: Escriu aquí el subtítol",
          },
          {
            controller: "essubtitle",
            error: errors.essubtitle,
            placeholder: "Castellano: Escribe aquí el subtítulo",
          },
          {
            controller: "ensubtitle",
            error: errors.ensubtitle,
            placeholder: "English: Write here the subtitle",
          },
        ].map((e) => (
          <div key={e.controller}>
            <Controller
              name={e.controller as "casubtitle" | "essubtitle" | "ensubtitle"}
              control={control}
              render={({ field }) => (
                <TextAreaWithCharCounter
                  {...field}
                  ariaInvalid={!!e.error}
                  className="w-full h-20 mb-2"
                  placeholder={e.placeholder}
                  name={e.controller}
                  control={control}
                />
              )}
            />

            {e.error && <FieldError>{e.error.message}</FieldError>}
          </div>
        ))}
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

                                //const target = e.target as FileReader;

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
        {errors.image && <FieldError>{errors.image.message}</FieldError>}
      </div>
      <div className="flex flex-col">
        <label htmlFor="content">Content</label>
        {[
          {
            controller: "cacontent",
            error: errors.cacontent,
            placeholder: "Català: Escriu aquí el contingut del post",
          },
          {
            controller: "escontent",
            error: errors.escontent,
            placeholder: "Castellano: Escribe aquí el contenido del post",
          },
          {
            controller: "encontent",
            error: errors.encontent,
            placeholder: "English: Write the post content here",
          },
        ].map((e) => (
          <div key={e.controller} className="mb-4">
            <Controller
              name={e.controller as "cacontent" | "escontent" | "encontent"}
              control={control}
              render={({ field }) => (
                <ReactQuillEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={e.placeholder}
                  className="w-full  focus:border-secondary-500 "
                />
              )}
            />
            {e.error && <FieldError>{e.error.message}</FieldError>}
          </div>
        ))}
        {/* <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <ReactQuillEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Whatever"
              className="w-full  focus:border-secondary-500"
            />
            // <TextAreaWithCharCounter
            //   {...field}
            //   ariaInvalid={!!errors.content}
            //   maxLength={3000}
            //   className="w-full h-64"
            //   placeholder="The content of your post goes here"
            //   name="content"
            //   control={control}
            //   withAddLink={true}
            // />
          )}
        />

        {errors.content && <FieldError>{errors.content.message}</FieldError>} */}
      </div>
      <div className="flex justify-between">
        <Button buttonClassName={"btn-secondary-500"}>Publish</Button>
      </div>
    </form>
  );
};
