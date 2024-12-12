import { OpinionForm } from "@/components/forms/OpinionForm";
import { setRequestLocale } from "next-intl/server";

export default function Opinion({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <OpinionForm />;
}
