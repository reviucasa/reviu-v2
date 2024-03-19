import { StayForm } from "@/components/forms/StayForm";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Stay({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <StayForm />;
}
