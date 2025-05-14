"use client";
import { AddressComboBox } from "@/components/atoms/AddressComboBox";
import { Button } from "@/components/atoms/Button";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Switch,
} from "@headlessui/react";
import Image from "next/image";
import Logo from "public/images/reviuLogo.svg";
import { Suspense, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { BounceLoader } from "react-spinners";
import { mutate } from "swr";
import lupaGreen from "public/images/lupa-green.png";
import { FieldError } from "../atoms/FieldError";
import { UserMenuNavbar } from "../atoms/UserMenuNavbar.server";
import { usePathname, useRouter } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { signOut } from "@/firebase/auth";
import { useAuth } from "@/context/auth";
import { AgencyComboBox } from "../atoms/AgencyComboBox";
import { RealStateAgency } from "@/models/agency";
import { classNames } from "@/helpers/classNames";
import { Link } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { getCatastroDataFromAddress } from "@/helpers/catastroFunctions";
import { encodeForReadableURI } from "@/helpers/stringHelpers";
import { mainCitiesNeighbourhoods, provincesData } from "@/staticData";
import { getMunicipalityCoordinates } from "@/helpers/getMunicipalityCoordinates";

export function NavbarHome({ search = true }: { search?: boolean }) {
  const t = useTranslations();
  const tLinks = useTranslations("linksTitles");

  const [enabled, setEnabled] = useState(false);
  const [searchType, setSearchType] = useState<string>("address");
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [selectedRealStateAgency, setSelectedRealStateAgency] =
    useState<RealStateAgency>();

  const router = useRouter();
  const locale = useLocale();
  const params = useSearchParams();
  const pathname = usePathname();

  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const onSelectAddress = async (address: string) => {
    setError(undefined);
    setSelectedAddress(address);
    if (address && address != "") {
      setLoading(true);
      console.log(address)
      if (Object.keys(provincesData).includes(address.split(" - ")[1].toUpperCase())) {
        console.log("Searching province...");
        if (
          provincesData[address.split(" - ")[1].toUpperCase()].includes(
            address.split(" - ")[0].toUpperCase()
          )
        ) {
          router.push(
            `/explore/${address
              .split(" - ")
              .map((e) => encodeURIComponent(e))
              .join("/")
              .toLowerCase()}`
          );
          setLoading(false);

          return;
        }
      }

      if (
        Object.keys(mainCitiesNeighbourhoods).includes(address.split(" - ")[1])
      ) {
        if (
          mainCitiesNeighbourhoods[address.split(" - ")[1]].includes(
            address.split(" - ")[0]
          )
        ) {
          const coordinates = await getMunicipalityCoordinates(
            address.split(" - ")[0],
            address.split(" - ")[1]
          );
          if (coordinates != null) {
            router.push(
              `/explore?lat=${coordinates?.lat}&lng=${
                coordinates?.lng
              }&name=${encodeURIComponent(address)}`
            );
            setLoading(false);

            return;
          } else {
            console.log("Couldn't find neighbourhood", address);
            setLoading(false);

            return;
          }
          /* router.push(
            `/explore/${address.split(", ").join("/").toLowerCase()}`
          ); */
        }
      }

      const res = await getCatastroDataFromAddress(address);
      if (res) {
        const ubi = res.response.bico
          ? res.response.bico?.localizacion.ubicacion
          : res.response.listaRegistroCatastral
          ? res.response.listaRegistroCatastral.registros[0].localizacion
              .ubicacion
          : null;

        const municipality = res.response.bico
          ? res.response.bico?.localizacion.municipio
          : res.response.listaRegistroCatastral
          ? res.response.listaRegistroCatastral.registros[0].localizacion
              .municipio
          : null;

        const province = res.response.bico
          ? res.response.bico?.localizacion.provincia
          : res.response.listaRegistroCatastral
          ? res.response.listaRegistroCatastral.registros[0].localizacion
              .provincia
          : null;

        const err = res.response.errores;
        if (ubi && municipality && province) {
          const link = encodeForReadableURI(
            [
              province,
              municipality,
              ubi.direccion.siglas,
              ubi.direccion.nombre,
              ubi.direccion.numero,
            ].join("/")
          );
          router.push(`/building/${link}`);
        } else if (err) {
          console.log(err[0].desc, address);
          const num = res.response.numerero;
          if (num) {
            console.log(
              "Options: ",
              num.map((n) => n.numero)
            );
            setError(
              t("common.noSeEncontroDirección") +
                `. Options: ${num.map((n) => n.numero).toString()}`
            );
          } else {
            setError(err[0].desc);
          }
        } else {
          console.log("error fetching:", address);
        }
      } else {
        console.log("catastro data not found");
        const addressRegex = /^(.*?),\s*(\d+)/;
        const match = address.match(addressRegex);
        if (!match) {
          setError(t("common.missingStreetNumber"));
        } else {
          setError(t("common.noSeEncontroDirección"));
        }
      }
      /* } else {
        console.log("error cleaning address");
        setError(t("common.noSeEncontroDirección") + ": municipality error");
      } */

      setLoading(false);
    }
  };

  const onSelectRealStateAgency = async (agency: RealStateAgency) => {
    setSelectedRealStateAgency(agency);
    if (agency) {
      router.push(
        `/agency/${encodeURIComponent(agency.lowercase.replaceAll(" ", "-"))}`
      );
    } else {
      setError(t("common.noSeEncontroLaInmobiliaria"));
    }
  };

  return (
    <Suspense>
      {loading && (
        <div className="flex justify-center items-center fixed  w-full h-full z-50 bg-white opacity-90">
          <BounceLoader color="#d8b4fe" size={140} />
        </div>
      )}
      <div
        className={`flex items-center justify-between w-full h-20 ${
          error ? "h-24" : "h-20"
        } lg:py-4 lg:px-14 px-4 mb-1 bg-white`}
      >
        <Image
          quality={100}
          src={Logo}
          alt="Reviu Casa"
          width={120}
          className="object-contain  cursor-pointer h-auto"
          onClick={() => {
            router.push("/");
          }}
        />

        {search && (
          <>
            <div className="flex flex-col flex-1">
              {searchType == "address" ? (
                <AddressComboBox
                  placeholder={t("common.buscar")}
                  className="flex-1 mx-10 hidden md:block"
                  selectedAddress={selectedAddress}
                  setSelectedAddress={onSelectAddress}
                  selectedAddressLoading={loading}
                />
              ) : (
                <AgencyComboBox
                  icon={lupaGreen}
                  placeholder={t("common.searchAgency")}
                  className="flex-1 mx-10 hidden md:block"
                  selectedRealStateAgency={selectedRealStateAgency}
                  setSelectedRealStateAgency={onSelectRealStateAgency}
                />
              )}
              <FieldError className="absolute mx-10 top-[74px] hidden md:block">
                {error}
              </FieldError>
              <div
                className={classNames(
                  "absolute  self-end mx-12 hidden lg:block",
                  error ? "top-[32px]" : "top-[24px]"
                )}
              >
                <Switch
                  checked={enabled}
                  onChange={(v) => {
                    setEnabled(v);
                    setSearchType(v ? "agency" : "address");
                  }}
                  className={classNames(
                    enabled ? "bg-primary-100" : "bg-secondary-200",
                    ["es", "ca"].includes(locale) ? "w-40" : "w-36",
                    "relative inline-flex flex-row items-center justify-start h-8  cursor-pointer rounded-md ring-1 ring-gray-300 transition-colors duration-200 ease-in-out focus:outline-none"
                  )}
                >
                  <span
                    className={classNames(
                      "text-xs font-normal text-gray-800 absolute",
                      ["es", "en"].includes(locale) ? "right-3" : "right-2"
                    )}
                  >
                    {t("common.Agency")}
                  </span>
                  <span
                    className={classNames(
                      "text-xs font-normal text-gray-800 absolute",
                      locale == "es"
                        ? "left-2"
                        : locale == "en"
                        ? "left-3"
                        : "left-4"
                    )}
                  >
                    {t("common.Address")}
                  </span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      enabled ? "translate-x-[58px]" : "-translate-x-[14px]",
                      enabled ? "border-primary-500" : "border-secondary-500",
                      ["es", "ca"].includes(locale) && enabled
                        ? "w-[84px]"
                        : "w-[68px]",
                      "pointer-events-none block h-7  transform bg-white/0 border-2 rounded-md ring-0 transition duration-200 ease-in-out"
                    )}
                  />
                </Switch>
              </div>
            </div>
            <div>
              {auth.user && (
                <div className="md:flex hidden mr-10">
                  <Button
                    buttonClassName="btn-primary-500"
                    onClick={() => router.push("/newReview")}
                  >
                    {t("common.writeReview")}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
        <UserMenuNavbar />
        <div className="md:hidden">
          <Menu as="div">
            <MenuButton>
              <GiHamburgerMenu />
            </MenuButton>
            <div //Transition.Child
              className="absolute top-[80px] left-0 w-full z-10"
              // enter="transition ease-out duration-500"
              // enterFrom="opacity-20 -translate-y-10"
              // enterTo="opacity-100 translate-y-10"
              // leave="transition ease-in duration-75"
              // leaveFrom="transform opacity-100 scale-100"
              // leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="bg-white flex flex-col items-center gap-5 p-4">
                {auth.user != null ? (
                  <>
                    <MenuItem>
                      <Link
                        href="/account"
                        title={tLinks("/account")}
                        className="hover:no-underline"
                        // buttonClassName="content-center"
                        // onClick={() => {
                        //   router.push("/account");
                        // }}
                      >
                        {t("common.cuenta")}
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/my-reviews"
                        title={tLinks("/myReviews")}
                        className="hover:no-underline"
                      >
                        {t("common.myReviews")}
                      </Link>
                    </MenuItem>
                    {auth.claims.admin == true && (
                      <MenuItem>
                        <Link
                          href="/admin"
                          className=" text-secondary-500 hover:no-underline"
                          // buttonClassName="content-center"
                          // onClick={() => {
                          //   router.push("/admin");
                          // }}
                        >
                          Admin
                        </Link>
                      </MenuItem>
                    )}
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          className={`p-2 hover:no-underline ${
                            focus && "bg-secondary-200"
                          }`}
                          href="mailto:info@reviucasa.com"
                          title={"Email"}
                        >
                          {t("common.soporte")}
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      <Button
                        className="!w-full"
                        buttonClassName="content-center"
                      >
                        <span
                          className={"cursor-pointer"}
                          onClick={async () => {
                            localStorage.clear();
                            await signOut();
                            mutate(
                              () => true, // which cache keys are updated
                              undefined, // update cache data to `undefined`
                              { revalidate: false } // do not revalidate
                            );
                            pathname.includes("/newReview")
                              ? router.push("/")
                              : params.toString().includes("mode=signIn")
                              ? router.replace("/")
                              : router.refresh();
                          }}
                        >
                          {t("common.cerrarSesión")}
                        </span>
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button
                        className="btn-primary-500 w-full"
                        onClick={() => router.push("/newReview")}
                      >
                        {t("common.writeReview")}
                      </Button>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem>
                      <Link
                        href="/auth/login"
                        title={tLinks("/auth/login")}
                        className="content-center hover:no-underline"
                        // onClick={() => {
                        //   router.push("/auth/login");
                        // }}
                      >
                        {t("common.logIn")}
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/auth/login"
                        title={tLinks("/auth/register")}
                        className="content-center hover:no-underline"
                        // onClick={() => {
                        //   router.push("/auth/login");
                        // }}
                      >
                        {t("common.signIn")}
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/newReview"
                        title={tLinks("/newReview")}
                        className="btn btn-primary-500 content-center !w-full"
                        // onClick={() => router.push("/newReview")}
                      >
                        {t("common.writeReview")}
                      </Link>
                    </MenuItem>
                  </>
                )}
              </MenuItems>
            </div>{" "}
          </Menu>
        </div>
      </div>
    </Suspense>
  );
}
