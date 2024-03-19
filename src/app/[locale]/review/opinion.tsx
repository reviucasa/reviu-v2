import { OpinionForm } from "@/components/forms/OpinionForm";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Opinion({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <OpinionForm />;
}
