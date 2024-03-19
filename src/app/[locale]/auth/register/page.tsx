import { RegisterForm } from "@/components/forms/RegisterForm";
import { LoginLayout } from "@/components/layouts/LoginLayout";
import RegisterAsset from "../../../../../public/register_asset.png";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Register({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <LoginLayout image={RegisterAsset} imageAlt="register reviu">
      <RegisterForm />
    </LoginLayout>
  );
}
