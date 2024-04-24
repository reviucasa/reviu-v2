import { useCallback, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { Button } from "../atoms/Button";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebase/config";
import { sendSignInLink } from "@/firebase/auth";

let schema = yup.object().shape({
  email: yup.string().required().email(),
});

export const LoginForm = () => {
  const [validForm, setValidForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const refEmail = useRef<HTMLInputElement>(null);
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();

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
      if (window.location.hostname == "localhost") {
        await sendSignInLink(email!);
        router.push("/auth/checkEmail");
      } else {
        const sendSignInLinkToEmail = httpsCallable(
          functions,
          "sendSignInLinkToEmail"
        );
        // Call the function and pass data
        const url = `${window.location.protocol}//${window.location.host}`;
        try {
          const response = await sendSignInLinkToEmail({ email, locale, url });
          window.localStorage.setItem("email", email || "none");
          router.push("/auth/checkEmail");
        } catch (error) {
          console.error("Function call failed:", error);
          setLoading(false);
          throw error;
        }
      }
    }
    setLoading(false);
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
