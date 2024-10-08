"use client";
import { Button } from "@/components/atoms/Button";
import { Comment } from "@/components/atoms/Comment";
import { FieldError } from "@/components/atoms/FieldError";
import { AccountLayout } from "@/components/layouts/AccountLayout";
import { AccountCard } from "@/components/molecules/accountCard";
import { Switch } from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import padlock from "public/images/padlock.png";
import smallPadlock from "public/images/smallPadlock.png";
import { useUser } from "@/hooks/swr/useUser";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { deleteUser, updateUser } from "@/models/user";
import { useAuth } from "@/context/auth";
import { Genders, countries } from "@/staticData";
import { deleteAuthUser } from "@/firebase/auth";

const schema = yup.object({
  name: yup.string(),
  lastname: yup.string(),
  birthday: yup
    .string()
    .test(
      "is-older-than-18",
      "Para tener una cuenta es necesario ser mayor de edad",
      (value) => {
        if (!value) return true; // Pass validation if value is null or undefined

        // Parse the date string (assuming 'YYYY-MM-DD' format)
        const birthdate = dayjs(value, "YYYY-MM-DD");
        const cutoffDate = dayjs().subtract(18, "years");

        // Check if the birthdate is before the cutoff date
        return birthdate.isBefore(cutoffDate);
      }
    ),
  /* .date()
    .max(
      dayjs().subtract(18, "years").toDate(), // Ensure age is over 18
      "Para tener una cuenta es necesario ser mayor de edad"
    )
    .nullable()
    .transform((value, originalValue) =>
      originalValue === ""
        ? null
        : originalValue
        ? new Date(originalValue)
        : value
    ), */
  country: yup.string(),
  gender: yup.string(),
  subscribedToNewsletter: yup.boolean(),
});

type EditData = yup.InferType<typeof schema>;

/* 
type EditData = {
  name: string;
  lastname: string;
  birthday: string;
  country: string;
  gender: string;
  subscribedToNewsletter: boolean;
}; */

export default function Account() {
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();
  const [enabled, setEnabled] = useState<boolean | undefined>(
    user?.subscribedToNewsletter
  );
  const locale = useLocale();
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<EditData>({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  const isFormCompleted = isValid && !isDirty;

  const onSubmit: SubmitHandler<EditData> = async (data) => {
    const { lastname, ...restData } = data;
    const userData: any = {
      ...restData,
      lastname: lastname || user?.lastname,
      subscribedToNewsletter: enabled,
    };
    await updateUser(user!.id, {
      ...userData,
      birthday: dayjs(data.birthday).format("DD/MM/YYYY"),
    });

    const formattedBirthday = user?.birthday
      ? getStringDate(user.birthday)
      : "";

    reset({
      ...userData,
      birthday: formattedBirthday,
    });
    /* router.refresh(); */
  };

  const getStringDate = (date?: string) => {
    if (!date) return "";
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const formattedBirthday = user?.birthday
      ? getStringDate(user.birthday)
      : "";
    reset({
      name: user?.name,
      lastname: user?.lastname,
      birthday: formattedBirthday,
      country: user?.country ?? undefined,
      gender: user?.gender ?? undefined,
    });
  }, [user, reset]);

  useEffect(() => {
    if (user?.subscribedToNewsletter !== enabled) {
      setEnabled(user?.subscribedToNewsletter);
    }
  }, [user?.subscribedToNewsletter]);

  return (
    <>
      {/* <HomeReviewHead
        title={t("account.account", "Cuenta")}
        description="Cuenta Home Review page"
      /> */}
      <AccountLayout>
        <div className="lg:px-44 lg:pt-16 lg:pb-32 bg-white p-4 mb-11 lg:mb-0">
          <h5 className="lg:text-3xl mb-10">{t("account.account")}</h5>
          <div className="relative grid lg:grid-cols-[1fr_auto] lg:gap-8 md:gap-4 grid-cols-1">
            <div className="w-full">
              <h5>{t("account.inicioSesion")}</h5>
              <AccountCard
                emailAccount={auth.user?.email ?? undefined}
                image={smallPadlock}
                imageAlt={"20"}
                className="mt-8 mb-14"
              >
                <p className="text-base text-neutral-500">
                  {t("account.textCardUser")}{" "}
                  <span className="font-bold text-primary-900">
                    {t("account.contactUs")}
                  </span>
                </p>
              </AccountCard>
              <div className="w-auto lg:hidden">
                <Comment
                  commentTitle={t("account.protectIdentity")}
                  comment={t("account.dataNoVisible")}
                  image={padlock}
                  className="sticky top-10 lg:w-72 w-full mb-6"
                  tailSign={false}
                />
              </div>
              <div className="mb-14">
                <div className="flex justify-between items-center pb-4">
                  <h5>{t("account.notification")}</h5>
                  <Switch
                    as="div"
                    checked={enabled}
                    onChange={async (val) => {
                      setEnabled(val);
                      await updateUser(user!.id, {
                        subscribedToNewsletter: val,
                      });
                    }}
                    className={`${
                      enabled ? "bg-purple-100" : "bg-primary-200"
                    } relative inline-flex h-3 w-11 items-center rounded-full`}
                  >
                    <span
                      className={`${
                        enabled
                          ? "translate-x-6 bg-purple-400"
                          : "bg-primary-300"
                      } h-5 w-5 rounded-full`}
                    />
                  </Switch>
                </div>
                <p className="font-normal text-neutral-500 lg:w-3/4">
                  {t("account.activateNotification")}
                </p>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="border-b-[1px]"
              >
                <h5>{t("account.personalInformation")}</h5>
                <div className="grid lg:grid-cols-2 lg:grid-rows-2 grid-col gap-x-2 gap-y-6 mt-8 mb-6">
                  <div>
                    <label>{t("common.nombre")}</label>
                    <input
                      placeholder={t("common.tuNombre")}
                      type="text"
                      className="w-full px-4 py-2"
                      {...register("name")}
                    />
                  </div>
                  <div>
                    <label>{t("common.apellidos")}</label>
                    <input
                      placeholder={t("common.apellidos")}
                      type="text"
                      className="w-full px-4 py-2"
                      {...register("lastname")}
                    />
                  </div>
                  <div>
                    <label>{t("common.fechaNacimiento")}</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2"
                      {...register("birthday")}
                    />
                    {errors.birthday && (
                      <FieldError>{errors.birthday.message}</FieldError>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <label>{t("account.country")}</label>
                      <span className="text-gray-500 text-sm">
                        {t("common.opcional")}
                      </span>
                    </div>

                    <select className="w-full" {...register("country")}>
                      <option disabled value="">
                        {t("common.dinosTuNacionalidad")}
                      </option>
                      {countries
                        .sort((x, y) => x[locale].localeCompare(y[locale]))
                        .map((country) => {
                          return (
                            <option key={country[locale]} value={country.en}>
                              {country[locale]}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
                <div className="relative flex flex-col mb-16">
                  <div className="flex justify-between items-baseline">
                    <label>{t("common.genero")}</label>
                    <span className="text-sm text-gray-500">
                      {t("common.opcional")}
                    </span>
                  </div>
                  <select className="mb-10" {...register("gender")}>
                    {Genders.map((Genders) => {
                      return (
                        <option key={Genders[locale]} value={Genders.en}>
                          {Genders[locale]}
                        </option>
                      );
                    })}
                  </select>
                  <div className="flex lg:flex-row lg:justify-between flex-col">
                    {" "}
                    <p className="font-normal text-neutral-500 lg:w-3/4 w-full order-last lg:order-first">
                      {t("account.textDataStatsFirstPart")}{" "}
                      <span
                        onClick={() => router.push("/privacyPolicy")}
                        className="font-bold text-primary-900 cursor-pointer hover:underline"
                      >
                        {t("common.politicaPrivacidad")}
                      </span>
                      {". "}
                      {t("account.textDataStatsSecondPart")}
                    </p>
                    <Button
                      className="!w-full lg:!w-fit mb-6"
                      buttonClassName={
                        isFormCompleted
                          ? "btn-primary-transparent font-semibold"
                          : "btn-primary-500"
                      }
                      disabled={isFormCompleted}
                    >
                      {isFormCompleted
                        ? t("common.guardado")
                        : t("common.guardar")}
                    </Button>
                  </div>
                </div>
              </form>
              <div className="mt-16 mb-8">
                <h5 className="mb-8">{t("account.gestionaTusDatos")}</h5>
                <div className="grid lg:grid-cols-[1fr_auto] grid-col">
                  <div className="">
                    <label className="mb-2">
                      {t("account.eliminarCuenta")}
                    </label>
                    <p className="font-normal text-neutral-500 lg:w-3/4 w-full lg:mb-0 mb-6">
                      {t("account.tuCuentaSeBorrara")}
                    </p>
                  </div>
                  <span
                    className="flex text-red-600 font-medium items-center cursor-pointer"
                    onClick={async () => {
                      console.log("delete user");
                      await deleteUser(user!.id);
                      await deleteAuthUser();
                      router.push("/");
                      // TODO: enviar email al correu confirmant deletion
                    }}
                  >
                    {t("account.eliminarCuenta")}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-auto lg:block hidden">
              <Comment
                commentTitle={t("account.protectIdentity")}
                comment={t("account.dataNoVisible")}
                className="sticky top-10 mb-8 w-80 "
                classNameText="w-full"
                image={padlock}
              />
            </div>
          </div>
        </div>
      </AccountLayout>
    </>
  );
}
