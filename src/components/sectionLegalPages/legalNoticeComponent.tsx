import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";

export async function LegalNoticeComponent({
  className,
  withTitle = true,
}: {
  className?: string;
  withTitle?: boolean;
}) {
  const t = await getTranslations();
  const tLinks = await getTranslations("linksTitles");

  return (
    <div className={`${className}`}>
      <h2 className="mb-10">{t("legalNotice.title")}</h2>
      <div className="flex flex-col justify-start">
        <h5 className="my-2 font-extrabold">
          {t("legalNotice.identificacion")}
        </h5>
        <div className="flex flex-col gap-3 mb-10">
          <p>
            {" "}
            <strong>{t("legalNotice.identificacionP1")}</strong>
            {t("legalNotice.identificacionP2")}
            <strong>{t("legalNotice.identificacionP3")}</strong>{" "}
            {t("legalNotice.identificacionP4")}
          </p>
          <p> {t("legalNotice.identificacionP5")}</p>
          <div className="ml-12">
            <span className="flex">
              <strong>{t("legalNotice.identificacionP6")}</strong>
              <span className="text-blue-500">
                &nbsp;
                {t("legalNotice.identificacionP9")}
              </span>
            </span>
            <span className="flex">
              <strong>{t("legalNotice.identificacionP7")}</strong>
              &nbsp;
              {t("legalNotice.identificacionP8")}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3 mb-10">
          <h5 className="my-2 font-extrabold">{t("legalNotice.sitioWeb")}</h5>
          <div className="ml-12">
            <p>
              {t("legalNotice.sitioWebP1")}
              {t("legalNotice.sitioWebP2")}
              {t("legalNotice.sitioWebP3")}{" "}
              <Link
                className="text-blue-500 cursor-pointer"
                href="/termsAndConditions"
                title={tLinks("/termsAndConditions")}
              >
                {t("legalNotice.sitioWebP4")}
              </Link>{" "}
              {t("legalNotice.sitioWebP6")}{" "}
              <Link
                className="text-blue-500 cursor-pointer"
                href="/privacyPolicy"
                title={tLinks("/privacyPolicy")}
              >
                {t("legalNotice.sitioWebP7")}
              </Link>
              {t("legalNotice.sitioWebP8")}{" "}
              <span className="text-blue-500">
                {t("legalNotice.sitioWebP9")}
              </span>
            </p>
            <p>{t("legalNotice.sitioWebP10")} </p>
            <p>{t("legalNotice.sitioWebP11")} </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 mb-10">
          <h5 className="my-2 font-extrabold">{t("legalNotice.privacidad")}</h5>
          <p>
            {t("legalNotice.privacidadP1")}
            <Link
              className="text-blue-500 cursor-pointer"
              href="/privacyPolicy"
              title={tLinks("/privacyPolicy")}
            >
              {" "}
              {t("legalNotice.privacidadP2")}
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-3 mb-10">
          <h5 className="my-2 font-extrabold">{t("legalNotice.cookies")}</h5>
          <p>
            {t("legalNotice.cookiesP1")}
            <span className="text-blue-500"> {t("legalNotice.cookiesP2")}</span>
          </p>
        </div>
        <div className="flex flex-col gap-3 mb-10">
          <h5 className="my-2 font-extrabold">
            {t("legalNotice.intelectual")}
          </h5>
          <p>{t("legalNotice.intelectualP1")}</p>
          <p>{t("legalNotice.intelectualP2")}</p>
        </div>
        <div className="flex flex-col gap-3 mb-10">
          <h5 className="my-2 font-extrabold">
            {t("legalNotice.responibilidad")}
          </h5>
          <p>{t("legalNotice.responibilidadP1")}</p>
          <p>
            {t("legalNotice.responibilidadP2")}{" "}
            <a
              className="text-blue-500 cursor-pointer"
              href="/termsAndConditions"
            >
              {t("legalNotice.responibilidadP3")}
            </a>{" "}
            {t("legalNotice.responibilidadP4")}
          </p>
          <p>{t("legalNotice.responibilidadP5")}</p>
          <p>{t("legalNotice.responibilidadP6")}</p>
          <p>{t("legalNotice.responibilidadP7")}</p>
          <p>{t("legalNotice.responibilidadP8")}</p>
        </div>
        <div className="flex flex-col gap-3 mb-10">
          <h5 className="my-2 font-extrabold">
            {t("legalNotice.comerciales")}
          </h5>
          <p>{t("legalNotice.comercialesP1")}</p>
          <p>
            {t("legalNotice.comercialesP2")}{" "}
            <span className="text-blue-500">
              {t("legalNotice.comercialesP3")}
            </span>{" "}
          </p>
        </div>
        <div className="flex flex-col gap-3 mb-10">
          <h5 className="my-2 font-extrabold">{t("legalNotice.enlaces")}</h5>
          <p>{t("legalNotice.enlacesP1")}</p>
          <p>{t("legalNotice.enlacesP2")}</p>
          <p>{t("legalNotice.enlacesP3")}</p>
          <p>{t("legalNotice.enlacesP4")}</p>
        </div>
        <div className="flex flex-col gap-3 mb-10">
          <h5 className="my-2 font-extrabold">
            {t("legalNotice.modificaciones")}
          </h5>
          <p>
            {t("legalNotice.modificacionesP1")}{" "}
            <a
              className="text-blue-500 cursor-pointer"
              href="/termsAndConditions"
            >
              {t("legalNotice.modificacionesP2")}
            </a>{" "}
            {t("legalNotice.modificacionesP3")}{" "}
            <Link
              className="text-blue-500 cursor-pointer"
              href="/privacyPolicy"
              title={tLinks("/privacyPolicy")}
            >
              {t("legalNotice.modificacionesP4")}
            </Link>{" "}
            {t("legalNotice.modificacionesP5")}{" "}
            <span className="text-blue-500">
              {t("legalNotice.modificacionesP6")}
            </span>{" "}
            {t("legalNotice.modificacionesP7")}
          </p>
        </div>
      </div>
    </div>
  );
}
