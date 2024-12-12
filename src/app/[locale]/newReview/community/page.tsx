import { CommunityForm } from "@/components/forms/CommunityForm";
import { setRequestLocale } from "next-intl/server";

export default function Community({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <CommunityForm />;
}
