import { LoginForm } from "@/components/forms/LoginForm";
import { LoginLayout } from "@/components/layouts/LoginLayout";
import LoginImg from "public/images/login.png";
import { locales } from "../../layout";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const titleDetail =
    locale == "en"
      ? "Login to Reviu: Access Your Account"
      : locale == "es"
      ? "Iniciar Sesión en Reviu: Accede a tu cuenta"
      : "Inicia Sessió a Reviu: Accedeix al teu compte";

  const description =
    locale == "en"
      ? "Log in to your Reviu account to access your dashboard, submit reviews, and manage your profile. Stay connected with the latest updates on rental homes in Barcelona."
      : locale == "es"
      ? "Inicia sesión en tu cuenta de Reviu para acceder a tu panel de control, enviar reseñas y opiniones y gestionar tu perfil. Mantente conectado con las últimas actualizaciones sobre viviendas de alquiler en Barcelona."
      : "Inicia sessió al teu compte de Reviu per accedir al teu tauler, enviar ressenyes i opinions i gestionar el teu perfil. Mantén-te connectat amb les últimes actualitzacions sobre habitatges de lloguer a Barcelona.";

  return {
    title: titleDetail,
    description,
  };
}

export default function Login() {
  return (
    <>
      <LoginLayout image={LoginImg} imageAlt="Login">
        <LoginForm />
      </LoginLayout>
    </>
  );
}
