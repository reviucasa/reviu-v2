import { AddressForm } from "@/components/forms/AddressForm";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Address({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <AddressForm />;
}
