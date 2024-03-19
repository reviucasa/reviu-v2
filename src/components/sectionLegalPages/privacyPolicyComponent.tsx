import { useTranslations } from "next-intl";

export function PrivacyPolicyComponent({ className }: { className?: string }) {
  const t = useTranslations();

  return (
    <div className={className}>
      <h2 className="mb-10">{t("privacy.title")}</h2>
      <div className="flex flex-col justify-start">
        <div className="flex flex-col gap-3 mb-10">
          <p>
            <strong>{t("privacy.privacidadP1")}</strong>
            {t("privacy.privacidadP2")}
            <strong>{t("privacy.privacidadP3")}</strong>
            {t("privacy.privacidadP4")}
          </p>
          <p> {t("privacy.privacidadP5")}</p>
        </div>
        <div className="flex flex-col gap-3 mb-10">
          <h5 className="my-2 font-extrabold">{t("privacy.responsable")}</h5>
          <div className="ml-12">
            <span className="flex">
              <strong className="mr-2">{t("privacy.responsableP1")}</strong>{" "}
              {t("privacy.responsableP2")}
            </span>
            <span className="flex">
              <strong className="mr-2">{t("privacy.responsablep3")}:</strong>
              {t("privacy.responsableP4")}
            </span>
            <span className="flex">
              <strong className="mr-2">{t("privacy.responsablep5")}: </strong>{" "}
              {t("privacy.responsableP6")}
            </span>
            <span className="flex">
              <strong className="mr-2">{t("privacy.responsablep6")}:</strong>{" "}
              <a className="text-blue-500">{t("privacy.responsableP7")}</a>{" "}
            </span>
          </div>
        </div>
        <div className="my-4">
          <h5 className="my-2 font-extrabold">{t("privacy.conservación")}</h5>
          <table className="table-auto border-solid border-2 border-slate-400 my-5">
            <thead className="bg-gray-200 ">
              <tr className="text-left divide-x-2  divide-slate-400">
                <th className="p-2">{t("privacy.conservaciónTH1")}</th>
                <th className="p-2">{t("privacy.conservaciónTH2")}</th>
                <th className="p-2">{t("privacy.conservaciónTH3")}</th>
                <th className="p-2">{t("privacy.conservaciónTH4")}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-400">
              <tr className="divide-x-2 divide-y-2 divide-slate-400">
                <td className="p-2">
                  <strong>{t("privacy.conservacionTD1S")}</strong>
                  {t("privacy.conservacionTD1")}
                </td>
                <td className="p-2">{t("privacy.conservacionTD2")}</td>
                <td className="p-2">{t("privacy.conservacionTD3")}</td>
                <td className="p-2">{t("privacy.conservacionTD4")}</td>
              </tr>
              <tr className="divide-x-2 divide-y-2 divide-slate-400">
                <td className="p-2 ">
                  <strong>{t("privacy.conservacionTD2S")}</strong>
                  {t("privacy.conservacionTD5")}
                </td>
                <td className="p-2">{t("privacy.conservacionTD6")}</td>
                <td className="p-2">{t("privacy.conservacionT7")}</td>
                <td className="p-2">{t("privacy.conservacionTD8")}</td>
              </tr>
              <tr className="divide-x-2 divide-y-2 divide-slate-400">
                <td className="p-2 ">
                  <strong>{t("privacy.conservacionTD3S")}</strong>
                  {t("privacy.conservacionTD9")}
                </td>
                <td className="p-2">{t("privacy.conservacionTD10")}</td>
                <td className="p-2">{t("privacy.conservacionT11")}</td>
                <td className="p-2">{t("privacy.conservacionTD12")}</td>
              </tr>
              <tr className="divide-x-2 divide-y-2 divide-slate-400">
                <td className="p-2 ">
                  <strong>{t("privacy.conservacionTD4S")}</strong>
                  {t("privacy.conservacionTD13")}
                </td>
                <td className="p-2">{t("privacy.conservacionTD14")}</td>
                <td className="p-2">{t("privacy.conservacionT15")}</td>
                <td className="p-2">{t("privacy.conservacionTD16")}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3">
          <h5 className="my-2 font-extrabold">
            {t("privacy.destinatarios")}
          </h5>
          <p>{t("privacy.destinatariosP1")}</p>
          <ol className="list-disc list-inside ml-8">
            <li className="mb-3"> {t("privacy.destinatariosL1")}</li>
            <ol
              className="list-inside ml-8"
              style={{ listStyleType: "circle" }}
            >
              <li className="mb-3">{t("privacy.destinatariosL2")}</li>
              <li className="mb-3">{t("privacy.destinatariosL3")}</li>
              <li className="mb-3">{t("privacy.destinatariosL4")}</li>
              <li className="mb-3">{t("privacy.destinatariosL5")}</li>
              <li className="mb-3">{t("privacy.destinatariosL6")}</li>
              <li>{t("privacy.destinatariosL7")}</li>
            </ol>
          </ol>
          <p>{t("privacy.destinatariosP2")}</p>
          <p>{t("privacy.destinatariosP3")}</p>
          <p>{t("privacy.destinatariosP4")}</p>
          <ol className="list-disc list-inside ml-8">
            <li className="mb-3">{t("privacy.destinatariosL8")}</li>
            <li className="mb-3">{t("privacy.destinatariosL9")}</li>
            <li className="mb-3">{t("privacy.destinatariosL10")}</li>
          </ol>
          <p>{t("privacy.destinatariosP5")}</p>
        </div>
        <div>
          <h5 className="my-2 font-extrabold"></h5>
          <p>{t("privacy.seguridadP1")}</p>
        </div>
        <div>
          <h5 className="my-2 font-extrabold">{t("privacy.derechos")}</h5>
          <p>
            {t("privacy.derechosP1")}{" "}
            <a className="text-blue-500"> {t("privacy.derechosA1")}</a>{" "}
          </p>
          <p>
            {t("privacy.derechosP2")}
            <a className="text-blue-500">{t("privacy.derechosA2")}</a>
            {t("privacy.derechosP3")}
          </p>
        </div>
        <div>
          <h5 className="my-2 font-extrabold">
            {t("privacy.cambiosPolitica")}
          </h5>
          {t("privacy.cambiosPoliticaP1")}
        </div>
      </div>
    </div>
  );
}
