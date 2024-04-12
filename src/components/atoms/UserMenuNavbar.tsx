import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import Face from "public/face.png";
import { Fragment } from "react";
import { HiOutlineChevronUp } from "react-icons/hi";
import { mutate } from "swr";
import { Button } from "./Button";
import { useUser } from "@/hooks/swr/useUser";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut } from "@/firebase/auth";
import { useAuth } from "@/context/auth";

export const UserMenuNavbar = () => {
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const t = useTranslations();

  return auth.user ? (
    <Menu as="div" className="relative hidden md:block">
      {({ open }) => (
        <>
          <Menu.Button className="flex items-center bg-white rounded-full p-1 border w-auto">
            <div className="rounded-full bg-secondary-300 w-10 h-10 flex items-center justify-center cursor-pointer">
              <Image
                quality={100}
                src={Face}
                alt={"user"}
                className="h-auto"
                width={17}
              />
            </div>
            <span className="m-2">{user?.name}</span>
            <HiOutlineChevronUp
              className={`${open ? "" : "rotate-180 transform"} m-2`}
            />
          </Menu.Button>
          <Transition as={Fragment}>
            <Transition.Child
              className="absolute top-[48px] left-0 w-full z-10"
              enter="transition ease-out duration-500"
              enterFrom="opacity-20 -translate-y-10"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="bg-white flex flex-col absolute right-0 mt-2 w-52 p-1 rounded-lg z-10 border border-gray-200 ">
                <Menu.Item>
                  {({ active }) => (
                    <span
                      className={`p-2 cursor-pointer ${
                        active && "bg-secondary-200"
                      }`}
                      onClick={() => {
                        router.push("/account");
                      }}
                    >
                      {t("common.cuenta")}
                    </span>
                  )}
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
                  {({ active }) => (
                    <span
                      className={`p-2 cursor-pointer ${
                        active && "bg-secondary-200"
                      }`}
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
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition.Child>
          </Transition>
        </>
      )}
    </Menu>
  ) : (
    <div className="lg:flex hidden">
      <Button
        buttonClassName="content-center"
        onClick={() => {
          router.push("/auth/login");
        }}
      >
        {t("common.logIn")}
      </Button>
      <Button
        buttonClassName="content-center"
        onClick={() => {
          router.push("/auth/login");
        }}
      >
        {t("common.signIn")}
      </Button>
      <Button
        className="pl-8"
        buttonClassName="btn-primary-500"
        onClick={() => router.push("/review")}
      >
        {t("common.writeReview")}
      </Button>
    </div>
  );
};
