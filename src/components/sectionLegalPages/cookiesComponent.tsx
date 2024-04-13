import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const cookiesList = [
  {
    name: "NEXT_LOCALE",
    type: "technicalCookie",
    ownership: "reviuCasa",
    definition: "localeCookieDefinition",
    retentionPeriod: "session",
  },
];

export function CookiesComponent({ className }: { className?: string }) {
  const t = useTranslations("cookies");
  const router = useRouter();
  return (
    <div className={className}>
      <h2 className="mb-10">{t("title")}</h2>
      <div className="flex flex-col gap-3 mb-10">
        <p>
          <strong>{t("ownershipAndUsage")}</strong>
          {t("ownershipAndUsage1")}
          <strong>{t("reviuCasa")}</strong>
          {t("ownershipAndUsage2")}
          <strong>{t("webSite")}</strong>
          {t("ownershipAndUsage3")}
          <strong>{t("users")}</strong>
          {t("ownershipAndUsage4")}
        </p>
        <p>{t("ownershipAndUsage5")}</p>

        <h5 className="my-2 font-extrabold">{t("cookieDefinition")}</h5>
        <p>{t("cookieDefinition1")}</p>
        <p>
          {t("cookieDefinition2")}{" "}
          <a
            target="_blank"
            className="text-blue-500 cursor-pointer"
            href="https://es.wikipedia.org/wiki/Cookie_(inform%C3%A1tica)"
          >
            {t("articleLink")}
          </a>
          {t("cookieDefinition3")}
        </p>

        <h5 className="my-2 font-extrabold">{t("howWeUseCookies")}</h5>
        <p>{t("howWeUseCookies1")}</p>

        <h5 className="my-2 font-extrabold">{t("typesOfCookiesUsed")}</h5>
        <p>{t("typesOfCookiesUsed1")}</p>

        <ol
          type="a"
          className="ml-8 space-y-2"
          style={{ listStyleType: "lower-alpha" }}
        >
          <li>
            <p>
              <strong>{t("firstPartyCookies")}</strong>
              {t("firstPartyCookiesDesc")}
            </p>
          </li>
          <li>
            <p>
              <strong>{t("thirdPartyCookies")}</strong>
              {t("thirdPartyCookiesDesc")}
            </p>
          </li>
        </ol>

        <p>{t("typesOfCookiesUsed2")}</p>

        <ol
          type="a"
          className="ml-8 space-y-2"
          style={{ listStyleType: "lower-alpha" }}
        >
          <li>
            <p>
              <strong>{t("technicalCookies")}</strong>
              {t("technicalCookiesDesc")}
            </p>
          </li>
          <li>
            <p>
              <strong>{t("preferenceCookies")}</strong>
              {t("preferenceCookiesDesc")}
            </p>
          </li>
        </ol>

        <p>{t("typesOfCookiesUsed3")}</p>

        <h5 className="my-2 font-extrabold">{t("howToDisableCookies")}</h5>
        <p>{t("howToDisableCookies1")}</p>
        <p>{t("howToDisableCookies2")}</p>

        <ol className="ml-8" style={{ listStyleType: "circle" }}>
          <li>
            <a
              className="text-blue-500 cursor-pointer"
              href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09#:~:text=Abre%20Microsoft%20Edge%20y%20selecciona,sitio%20y%20luego%20Borrar%20ahora"
              target="_blank"
            >
              {t("howToDisableCookies3")}
            </a>
          </li>
          <li>
            <a
              className="text-blue-500 cursor-pointer"
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
            >
              {t("howToDisableCookies4")}
            </a>
          </li>
          <li>
            <a
              className="text-blue-500 cursor-pointer"
              href="support.mozilla.org/kb/delete-cookies-remove-info-websites-stored"
              target="_blank"
            >
              {t("howToDisableCookies5")}
            </a>
          </li>
          <li>
            <a
              className="text-blue-500 cursor-pointer"
              href="https://support.apple.com/es-es/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
              target="_blank"
            >
              {t("howToDisableCookies6")}
            </a>
          </li>
        </ol>
        <h5 className="my-2 font-extrabold">{t("moreInfo")}</h5>
        <p>
          {t("moreInfo1")}
          <span className="text-blue-500">{t("infoEmail")}</span>.
        </p>
      </div>
      <div className="sm:flex sm:items-center">
        <h5 className="my-2 font-extrabold">COOKIES</h5>
      </div>
      <div className="mt-6 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden  ">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Cookie
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      {t("type")}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      {t("ownership")}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      {t("definition")}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      {t("retentionPeriod")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {cookiesList.map((cookie) => (
                    <tr key={cookie.name}>
                      <td className="whitespace-nowrap py-2.5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {cookie.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                        {t(cookie.type)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                        {t(cookie.ownership)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                        {t(cookie.definition)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500 max-w-52 overflow-x-hidden text-ellipsis">
                        {t(cookie.retentionPeriod)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
