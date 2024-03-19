import { NeighbourhoodForm } from "@/components/forms/NeighbourhoodForm";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Neighbourhood({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <NeighbourhoodForm />;
}
