"use client";
import { FieldError } from "@/components/atoms/FieldError";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "../atoms/Button";
import { useLocale, useTranslations } from "next-intl";
import { Genders, countries } from "@/staticData";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "@/navigation";
import { updateAuthUser } from "@/firebase/auth";
import { createUser } from "@/models/user";
import { useAuth } from "@/context/auth";



export const RegisterForm = () => {
  const router = useRouter();
  const locale = useLocale();
  const auth = useAuth();
  const t = useTranslations();

  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    name: yup.string().required(t('registerForm.validations.nameIsRequired')),
    lastname: yup.string().required(t('registerForm.validations.nameIsRequired')),
    birthday: yup
      .date()
      .max(
        dayjs().subtract(18, "year").format("YYYY-MM-DD"),
        t('registerForm.validations.isOlderThan18'),
      )
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .required(t('registerForm.validations.dateOfBirthRequired')),
    country: yup.string().required(t('registerForm.validations.countryRequired')),
    gender: yup.string().required(t('registerForm.validations.genderRequired')),
    acceptedTerms: yup
      .boolean()
      .oneOf([true], t('registerForm.validations.dateOfBirthRequired')),
    subscribedToNewsletter: yup.boolean(),
  });
  
  type FormData = yup.InferType<typeof schema>;

  useEffect(() => {
    if (!auth) {
      router.replace("/auth/login");
    }
  }, [auth, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);

    if (isValid && auth.user) {
      try {
        await updateAuthUser(data.name + " " + data.lastname);
        await createUser(auth.user.uid, {
          ...data,
          email: auth.user.email!,
          birthday: dayjs(data.birthday).format("DD/MM/YYYY"),
          dateAcceptedTerms: dayjs(Date.now()).format("DD/MM/YYYY"),
        });

        router.replace("/");
      } catch (error: any) {
        console.log(error);
        setLoading(false);
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <h3>{t("registerForm.creaTuCuenta")}</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex flex-col gap-6"
      >
        <div className="grid xl:grid-cols-2 gap-y-6 gap-x-2 child:flex child:flex-col">
          <div>
            <label>{t("common.nombre")}</label>
            <input
              aria-invalid={!!errors.name}
              placeholder={t("registerForm.escribeTuNombre")}
              type="text"
              {...register("name")}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </div>
          <div>
            <label>{t("common.apellidos")}</label>
            <input
              aria-invalid={!!errors.lastname}
              placeholder={t("registerForm.escribeTusApellidos")}
              type="text"
              {...register("lastname")}
            />
            {errors.lastname && (
              <FieldError>{errors.lastname.message}</FieldError>
            )}
          </div>
          <div>
            <label>{t("common.fechaNacimiento")}</label>
            <input
              aria-invalid={!!errors.birthday}
              type="date"
              {...register("birthday")}
            />
            {errors.birthday && (
              <FieldError>{errors.birthday.message}</FieldError>
            )}
          </div>
          <div>
            <div className="flex justify-between items-baseline max-w-64">
              <label>{t("registerForm.nacionalidad")}</label>
              <span className="text-sm text-gray-500">
                {t("common.opcional")}
              </span>
            </div>
            <select
              aria-invalid={!!errors.country}
              defaultValue=""
              className="max-w-64"
              {...register("country")}
            >
              <option disabled value="">
                {t("common.dinosTuNacionalidad")}
              </option>
              {countries
                .sort((x, y) => x[locale!].localeCompare(y[locale!]))
                .map((country) => {
                  return (
                    <option key={country[locale!]} value={country.en}>
                      {country[locale!]}
                    </option>
                  );
                })}
            </select>
            {errors.country && (
              <FieldError>{errors.country.message}</FieldError>
            )}
          </div>
        </div>
        <div className="relative flex flex-col max-w-64">
          <div className="flex justify-between items-baseline">
            <label>{t("common.genero")}</label>
            <span className="text-sm text-gray-500">
              {t("common.opcional")}
            </span>
          </div>
          <select
            aria-invalid={!!errors.gender}
            defaultValue=""
            {...register("gender")}
          >
            <option disabled value="">
              {t("registerForm.seleccionaGenero")}
            </option>
            {Genders.map((Genders) => {
              return (
                <option key={Genders[locale!]} value={Genders.en}>
                  {Genders[locale!]}
                </option>
              );
            })}
          </select>
          {errors.gender && <FieldError>{errors.gender.message}</FieldError>}
        </div>
        <div className="flex flex-col flex-1 gap-4 text-primary-500 leading-4">
          <div className="flex">
            <input
              aria-invalid={!!errors.acceptedTerms}
              type="checkbox"
              {...register("acceptedTerms")}
            />
            <label className={errors.acceptedTerms && "text-red-500"}>
              {t("registerForm.aceptoTerminos")}
            </label>
          </div>
          <div className="flex">
            <input
              aria-invalid={!!errors.subscribedToNewsletter}
              type="checkbox"
              {...register("subscribedToNewsletter")}
            />
            <label>{t("registerForm.recibirComunicaciones")}</label>
            {errors.subscribedToNewsletter && (
              <FieldError>{errors.subscribedToNewsletter.message}</FieldError>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            className="my-10 w-full lg:w-auto lg:m-0"
            buttonClassName="btn-primary-500"
            loading={loading}
          >
            {t("common.continuar")}
          </Button>
        </div>
      </form>
    </div>
  );
};
