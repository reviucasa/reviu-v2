import { StayForm } from "@/components/forms/StayForm";
import { setRequestLocale } from "next-intl/server";

export default function Stay({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <StayForm />;
}
