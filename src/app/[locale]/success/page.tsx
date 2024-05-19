import Image from "next/image";
import okhand from "public/images/ok-hand.png";
import Link from "next/link";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export default async function Success({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations();

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
          {t("success.enBrevesSaldremos")}
          {"  "}
          {/* <span className="font-bold">{auth.currentUser?.email}</span> */}
        </p>
        <div className="flex gap-5">
          <Link
            className="btn btn-primary-500 mt-7 w-full lg:w-auto"
            href="/review"
          >
            {t("success.publicarOtraOpinion")}
          </Link>
          <Link className="btn btn-terciary-500 mt-7 w-full lg:w-auto" href="/">
            {t("success.menuPrincipal")}
          </Link>
        </div>
      </div>
      <div />
    </div>
  );
}
