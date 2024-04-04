"use client";
import { AddressComboBox } from "@/components/atoms/AddressComboBox";
import { Button } from "@/components/atoms/Button";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/reviuLogo.svg";
import { Suspense, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { BounceLoader } from "react-spinners";
import { mutate } from "swr";
import lupa from "../../../public/lupa.png";
import { FieldError } from "../atoms/FieldError";
import { UserMenuNavbar } from "../atoms/UserMenuNavbar";
import { useUser } from "@/hooks/swr/useUser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { signOut } from "@/firebase/auth";
import { useAuth } from "@/context/auth";
import { findBuildingByAddress } from "@/models/building";

export function NavbarHome({ search = true }: { search?: boolean }) {
  const t = useTranslations();

  const [selectedAddress, setSelectedAddress] = useState<string>();
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const onSelectAddress = async (address: string) => {
    setSelectedAddress(address);
    if (address && address != "") {
      setLoading(true);
      const building = await findBuildingByAddress(address);
      if (building) {
        router.push(`/building/${building.id}`);
      } else {
        setError(t("common.noSeEncontroDirección"));
      }
      setLoading(false);
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
              <AddressComboBox
                icon={lupa}
                placeholder={t("common.buscar")}
                className="flex-1 mx-10 hidden md:block"
                selectedAddress={selectedAddress}
                setSelectedAddress={onSelectAddress}
              />
              <FieldError className="absolute mx-10 top-[74px] hidden md:block">
                {error}
              </FieldError>
            </div>
            <div>
              {auth.user && (
                <div className="md:flex hidden mr-10">
                  <Button
                    buttonClassName="btn-primary-500"
                    onClick={() => router.push("/review")}
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
            <Menu.Button>
              <GiHamburgerMenu />
            </Menu.Button>
            <Transition>
              <Transition.Child
                className="absolute top-[40px] left-0 w-full z-10"
                enter="transition ease-out duration-500"
                enterFrom="opacity-20 -translate-y-10"
                enterTo="opacity-100 translate-y-10"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="bg-gray-100 flex flex-col items-center gap-5 p-4">
                  {auth.user != null ? (
                    <>
                      <Menu.Item>
                        <Button
                          className="!w-full"
                          buttonClassName="content-center"
                          onClick={() => {
                            localStorage.setItem("prevRoute", pathname);
                            router.push("/account");
                          }}
                        >
                          {t("common.cuenta")}
                        </Button>
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            className={`p-2 hover:no-underline ${
                              active && "bg-secondary-200"
                            }`}
                            href="mailto:info@reviucasa.com"
                          >
                            {t("common.soporte")}
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
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
                              pathname.includes("/review")
                                ? router.push("/")
                                : params.toString().includes("mode=signIn")
                                ? router.replace("/")
                                : router.refresh();
                            }}
                          >
                            {t("common.cerrarSesión")}
                          </span>
                        </Button>
                      </Menu.Item>
                      <Menu.Item>
                        <Button
                          className="w-full"
                          buttonClassName="btn-primary-500"
                          onClick={() => router.push("/review")}
                        >
                          {t("common.writeReview")}
                        </Button>
                      </Menu.Item>
                    </>
                  ) : (
                    <>
                      <Menu.Item>
                        <Button
                          buttonClassName="content-center"
                          onClick={() => {
                            router.push("/auth/login");
                          }}
                        >
                          {t("common.logIn")}
                        </Button>
                      </Menu.Item>
                      <Menu.Item>
                        <Button
                          buttonClassName="content-center"
                          onClick={() => {
                            router.push("/auth/login");
                          }}
                        >
                          {t("common.signIn")}
                        </Button>
                      </Menu.Item>
                      <Menu.Item>
                        <Button
                          className="!w-full"
                          buttonClassName="btn-primary-500 content-center"
                          onClick={() => router.push("/review")}
                        >
                          {t("common.writeReview")}
                        </Button>
                      </Menu.Item>
                    </>
                  )}
                </Menu.Items>
              </Transition.Child>
            </Transition>
          </Menu>
        </div>
      </div>
    </Suspense>
  );
}
