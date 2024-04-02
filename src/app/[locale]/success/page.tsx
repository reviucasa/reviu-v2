"use client";
import { Button } from "@/components/atoms/Button";
import { useUser } from "@/hooks/swr/useUser";
import { useTranslations } from "next-intl";
import Image from "next/image";
import okhand from "../../../../public/ok-hand.png";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";

export default function Success() {
  const router = useRouter();
  const { user } = useUser();
  //   const { clearReview } = useDraft();
  const t = useTranslations();

  return (
    <div className="grid lg:px-14 lg:py-14 lg:grid-rows-1 lg:grid-cols-[3fr_6fr_3fr]">
      <div />
      <div className="text-center flex flex-col items-center gap-4 mt-6 p-8 lg:w-100 lg:bg-white lg:rounded-2xl lg:my-4">
        <Image
          quality={100}
          className="mb-7"
          src={okhand}
          alt="Ok hand"
          width={100}
          height={100}
        />
        <h3>{t("success.graciasDejarOpinion")}</h3>
        <p>
          {t("success.enBrevesSaldremos")}{"  "}
          {/* <span className="font-bold">{auth.currentUser?.email}</span> */}
        </p>
        <div className="flex gap-5">
          <Button
            buttonClassName="btn-primary-500"
            className="mt-7 w-full lg:w-auto"
            onClick={async () => {
              // TODO: clear draft
              //   await revalidateUser();
              //   await clearReview();
              router.push("/review");
            }}
          >
            {t("success.publicarOtraOpinion")}
          </Button>
          <Button
            buttonClassName="btn-terciary-500"
            className="mt-7 w-full lg:w-auto"
            onClick={() => {
              router.push("/");
            }}
          >
            {t("success.menuPrincipal")}
          </Button>
        </div>
      </div>
      <div />
    </div>
  );
}
