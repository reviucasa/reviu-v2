import { ValuationForm } from "@/components/forms/ValuationForm";
import { setRequestLocale } from "next-intl/server";

export default function Valuation({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <ValuationForm />;
}
