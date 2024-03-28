import { useCallback, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { Button } from "../atoms/Button";
import { useTranslations } from "next-intl";
import { useUser } from "@/hooks/swr/useUser";
import { useRouter } from "next/navigation";
import { sendSignInLink } from "@/firebase/auth";

let schema = yup.object().shape({
  email: yup.string().required().email(),
});

export const LoginForm = () => {
  const [validForm, setValidForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const refEmail = useRef<HTMLInputElement>(null);
  const t = useTranslations();

  const validateEmail = useCallback(() => {
    const email = refEmail.current?.value;
    schema.isValid({ email }).then((valid) => {
      setValidForm(valid);
    });
  }, []);

  const handleSubmit = async () => {
    const email = refEmail.current?.value;
    setLoading(true);
    if (validForm) {
      await sendSignInLink(email!);
      alert("Check you email!");
    }
    setLoading(false);

    /* loginWithMagicLink(email as string)
      .then(() => {
        const prevRoute = localStorage.getItem("prevRoute");

        if (user && prevRoute) {
          router.push(prevRoute);
          localStorage.removeItem("prevRoute");
        }
      })
      .catch((err: AxiosError) => {
        console.log("Error during login: ", err);
      })
      .finally(() => {
        setLoading(false);
      }); */
  };

  useEffect(() => {
    document.body.className = "bg-white";
    return () => {
      document.body.className = "unset";
    };
  }, []);

  return (
    <div className="flex flex-col h-full justify-between lg:justify-start">
      <div>
        <h3>{t("loginForm.iniciaORegistrate")}</h3>
        <p className="mt-5">{t("loginForm.textDescubre")}</p>
        <label htmlFor="email" className="mt-10">
          {t("common.correoElectronico")}
        </label>
        <input
          className="w-full"
          onChange={validateEmail}
          ref={refEmail}
          placeholder={t("loginForm.escribeTuCorreo")}
          id="email"
          type="text"
        />
      </div>
      <Button
        className="self-end mt-8 mb-10 w-full lg:w-auto"
        buttonClassName="btn-primary-500"
        disabled={!validForm}
        loading={loading}
        onClick={handleSubmit}
      >
        {t("common.continuar")}
      </Button>
    </div>
  );
};
