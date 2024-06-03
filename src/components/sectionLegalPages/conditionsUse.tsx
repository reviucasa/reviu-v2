import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function ConditionsUseComponent({
  className,
}: {
  className?: string;
}) {
  const t = await getTranslations();
  const tLinks = await getTranslations("linksTitles");

  return (
    <div className={className}>
      <h1 className="mb-10 text-4xl">{t("conditions.title")}</h1>
      <div className="flex flex-col gap-3 mb-10">
        <h5 className="my-2 font-extrabold">
          {t("conditions.identificacion")}
        </h5>
        <p>{t("conditions.identificacionP1")}</p>
        <p>
          {t("conditions.identificacionP2")}
          <Link className="text-blue-500 cursor-pointer" href="/legalNotice" title={tLinks("/legalNotice")}>
            {t("conditions.identificacionA1")}
          </Link>
          ,{" "}
          <Link className="text-blue-500 cursor-pointer" href="/privacyPolicy" title={tLinks("/privacyPolicy")}>
            {t("conditions.identificacionA2")}
          </Link>
          , <span className="text-blue-500">{t("conditions.identificacionA3")}</span>{" "}
          {t("conditions.identificacionT")}{" "}
          <Link
            className="text-blue-500 cursor-pointer"
            href="/termsAndConditions"
            title={tLinks("/termsAndConditions")}
          >
            {t("conditions.identificacionA4")}
          </Link>{" "}
          {t("conditions.identificacionP2B")}
        </p>
        <p>{t("conditions.identificacionP3")}</p>
        <p>{t("conditions.identificacionP4")}</p>
        <span>
          <strong>{t("conditions.identificacionP5")}</strong>
          &nbsp;
          {t("conditions.identificacionP6")}
        </span>
        <span>
          <strong>{t("conditions.identificacionP7")}</strong>&nbsp;
          {t("legalNotice.identificacionP8")}
        </span>
      </div>
      <div className="flex flex-col gap-3 mb-10">
        <h5 className="my-2 font-extrabold">{t("conditions.descripcion")}</h5>
        <p>{t("conditions.descripcionP1")}</p>
      </div>
      <div className="flex flex-col gap-3 mb-10">
        <h5 className="my-2 font-extrabold">{t("conditions.cuentaUsuario")}</h5>
        <p>{t("conditions.cuentaUsuarioP1")}</p>
        <p>{t("conditions.cuentaUsuarioP2")}</p>
        <p>{t("conditions.cuentaUsuarioP3")}</p>
        <p>{t("conditions.cuentaUsuarioP4")}</p>
        <p>{t("conditions.cuentaUsuarioP5")}</p>
      </div>
      <div className="flex flex-col gap-3 mb-10">
        <h5 className="my-2 font-extrabold">
          {t("conditions.obligacionesUsuario")}
        </h5>
        <p>{t("conditions.obligacionesUsuarioP1")}</p>
        <p>{t("conditions.obligacionesUsuarioP2")}</p>
        <ol className="pl-3">
          <li className="flex">
            <p className="pr-3">I.</p>
            <p>{t("conditions.obligacionesUsuarioL1")}</p>
          </li>
          <li className="flex">
            <p className="pr-3">II.</p>
            <p>{t("conditions.obligacionesUsuarioL2")}</p>
          </li>
          <li className="flex">
            <p className="pr-3">III.</p>
            <p>{t("conditions.obligacionesUsuarioL3")}</p>
          </li>
          <li className="flex">
            <p className="pr-3">IV.</p>
            <p>{t("conditions.obligacionesUsuarioL4")}</p>
          </li>
          <li className="flex">
            <p className="pr-3">V.</p>
            <p>{t("conditions.obligacionesUsuarioL5")}</p>
          </li>
          <li className="flex">
            <p className="pr-3">VI.</p>
            <p>{t("conditions.obligacionesUsuarioL6")}</p>
          </li>
          <li className="flex">
            <p className="pr-3">VII.</p>
            <p>{t("conditions.obligacionesUsuarioL7")}</p>
          </li>
          <li className="flex">
            <p className="pr-3">VIII.</p>
            <p>{t("conditions.obligacionesUsuarioL8")}</p>
          </li>
        </ol>
        <p>{t("conditions.obligacionesUsuarioP3")}</p>
      </div>
      <div className="flex flex-col gap-3 mb-10">
        <h5 className="my-2 font-extrabold">
          {t("conditions.responsabilidadGarantias")}
        </h5>
        <p>{t("conditions.responsabilidadGarantiasP1")}</p>
        <p>{t("conditions.responsabilidadGarantiasP2")}</p>
        <p>{t("conditions.responsabilidadGarantiasP3")}</p>
        <p>{t("conditions.responsabilidadGarantiasP4")}</p>
        <p>{t("conditions.responsabilidadGarantiasP5")}</p>
        <p>{t("conditions.responsabilidadGarantiasP6")}</p>
        <p>{t("conditions.responsabilidadGarantiasP7")}</p>
        <p>{t("conditions.responsabilidadGarantiasP8")}</p>
      </div>
      <div className="flex flex-col gap-3 mb-10">
        <h5 className="my-2 font-extrabold">{t("conditions.intelectual")}</h5>
        <p>{t("conditions.intelectualP1")}</p>
        <p>{t("conditions.intelectualP2")}</p>
      </div>
      <div className="flex flex-col gap-3 mb-10">
        <h5 className="my-2 font-extrabold">{t("conditions.terceros")}</h5>
        <p>{t("conditions.tercerosP1")}</p>
        <p>{t("conditions.tercerosP2")}</p>
        <p>{t("conditions.tercerosP3")}</p>
        <p>{t("conditions.tercerosP4")}</p>
      </div>
      <div className="flex flex-col gap-3 mb-10">
        <h5 className="my-2 font-extrabold">
          {t("conditions.proteccionDatos")}
        </h5>
        <p>{t("conditions.proteccionDatosp1")}</p>
      </div>
      <div className="flex flex-col gap-3 mb-10">
        <h5 className="my-2 font-extrabold">{t("conditions.cookies")}</h5>
        <p>{t("conditions.cookiesP1")}</p>
      </div>
      <div className="flex flex-col gap-3 mb-10">
        <h5 className="my-2 font-extrabold">
          {t("conditions.comunicaciones")}
        </h5>
        <p>{t("conditions.comunicacionesP1")}</p>
        <p>{t("conditions.comunicacionesP2")}</p>
      </div>
      <div className="flex flex-col gap-3 mb-10">
        <h5 className="my-2 font-extrabold">{t("conditions.bajaPaginaWeb")}</h5>
        <p>
          {t("conditions.bajaPaginaWebP1")}{" "}
          <span className="text-blue-500">
            <a>{t("conditions.bajaPaginaWebE1")}</a>
          </span>{" "}
          {t("conditions.bajaPaginaWebP2")}
        </p>
        <p>{t("conditions.bajaPaginaWebP3")}</p>
      </div>
      <div className="flex flex-col gap-3 mb-10">
        <h5 className="my-2 font-extrabold">{t("conditions.reclamaciones")}</h5>
        <p>
          {t("conditions.reclamacionesP1")}{" "}
          <span className="text-blue-500">
            <a>{t("conditions.reclamacionesE1")}</a>
          </span>{" "}
          {t("conditions.reclamacionesP2")}
        </p>
        <p>
          {t("conditions.reclamacionesP3")}{" "}
          <span className="text-blue-500">
            {" "}
            <a>{t("conditions.reclamacionesE1")}</a>{" "}
          </span>{" "}
          {t("conditions.reclamacionesP4")}
        </p>
      </div>
      <div className="flex flex-col gap-3 mb-10">
        <h5 className="my-2 font-extrabold">{t("conditions.leyAplicable")}</h5>
        <p>{t("conditions.leyAplicableP1")}</p>
      </div>
    </div>
  );
}
