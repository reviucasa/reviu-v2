import { AddressForm } from "@/components/forms/AddressForm";
import { setRequestLocale } from "next-intl/server";

export default function Address({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <AddressForm />;
}
