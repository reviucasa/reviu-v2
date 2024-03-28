import { ValuationForm } from "@/components/forms/ValuationForm";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Valuation({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <ValuationForm />;
}
