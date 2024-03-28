import { CommunityForm } from "@/components/forms/CommunityForm";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Community({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <CommunityForm />;
}
