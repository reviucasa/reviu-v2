import { RegisterForm } from "@/components/forms/RegisterForm";
import { LoginLayout } from "@/components/layouts/LoginLayout";
import RegisterAsset from "../../../../../public/register_asset.png";

export default function Register() {
  return (
    <LoginLayout image={RegisterAsset} imageAlt="register reviu">
      <RegisterForm />
    </LoginLayout>
  );
}
