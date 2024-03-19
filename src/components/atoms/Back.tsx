import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { AiOutlineLeft } from "react-icons/ai";

export const Back = ({ className }: { className?: string }) => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <a
      className={`text-primary-500 flex gap-3 items-center cursor-pointer ${className}`}
      onClick={() => router.back()}
    >
      <AiOutlineLeft /> {t("common.atrás")}
    </a>
  );
};
