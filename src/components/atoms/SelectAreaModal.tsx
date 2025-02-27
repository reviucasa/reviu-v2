"use client";
import { Dispatch, SetStateAction } from "react";
import { Dialog } from "./Dialog";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { provincesData } from "@/staticData";
import { FieldError } from "./FieldError";
import { encodeForReadableURI, toTitleCase0 } from "@/helpers/stringHelpers";
import { Button } from "./Button";
import Image from "next/image";
import map from "public/images/maskGroup.png";
import { useRouter } from "@/navigation";

export const SelectAreaModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const schema = yup.object({
    province: yup.string().required(""),
    municipality: yup.string().required(""),
    neighbourhood: yup.string(),
  });

  type FormData = yup.InferType<typeof schema>;

  const {
    formState: { isValid, errors },
    register,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
    defaultValues: { province: "", municipality: "", neighbourhood: "" },
  });

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={"Encuentra las reseñas del área de tu elección"}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const link = `/explore/${encodeForReadableURI(
            watch("province")
          )}/${encodeForReadableURI(watch("municipality"))}`;

          if (isValid) {
            router.push(link);
          }
        }}
        className="relative flex flex-col gap-10 mt-8"
      >
        <div className="flex flex-col z-20">
          <div className="flex gap-6">
            <div className="w-1/2">
              <label>Provincia</label>
              <div className="w-full">
                <select
                  aria-invalid={!!errors.province}
                  className="w-full"
                  {...register("province")}
                >
                  <option value="">Provincia</option>
                  {Object.keys(provincesData).map((p) => (
                    <option key={p} value={p}>
                      {toTitleCase0(p)}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <FieldError>{errors.province.message}</FieldError>
                )}
              </div>
            </div>
            <div className="w-1/2">
              <label>Municipio</label>
              <div className="w-full">
                <select
                  aria-invalid={!!errors.municipality}
                  className="w-full"
                  {...register("municipality")}
                  disabled={watch("province") == ""}
                >
                  <option value="">Municipio</option>
                  {(watch("province")
                    ? provincesData[watch("province").toUpperCase()]
                    : []
                  ).map((m) => (
                    <option key={m} value={m}>
                      {toTitleCase0(m)}
                    </option>
                  ))}
                </select>
                {errors.municipality && (
                  <FieldError>{errors.municipality.message}</FieldError>
                )}
              </div>
            </div>
          </div>
        </div>
        <Button buttonClassName="btn-primary-500">Buscar</Button>

        {/* Image as background */}
        <div className="absolute -bottom-20 -right-20 z-10">
          <Image
            src={map}
            alt="Background map"
            className="w-640 h-auto"
            aria-hidden="true"
          />
        </div>
      </form>
    </Dialog>
  );
};
