import { NeighbourhoodForm } from "@/components/forms/NeighbourhoodForm";
import { setRequestLocale } from "next-intl/server";

export default function Neighbourhood({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <NeighbourhoodForm />;
}
