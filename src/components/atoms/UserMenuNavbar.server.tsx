import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Image from "next/image";
import Face from "public/images/face.png";
import { Fragment } from "react";
import { HiOutlineChevronUp } from "react-icons/hi";
import UserMenuClient from "./UserMenuClient";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/auth";
import { useUser } from "@/hooks/swr/useUser";
import { Link } from "@/navigation";

export const UserMenuNavbar = () => {
  const auth = useAuth();
  const { user } = useUser();
  const t = useTranslations();
  const tLinks = useTranslations("linksTitles");

  return auth.user ? (
    <Menu as="div" className="relative hidden md:block">
      {({ open }) => (
        <>
          <MenuButton className="flex items-center bg-white rounded-full p-1 border w-auto">
            <div className="rounded-full bg-secondary-300 w-10 h-10 flex items-center justify-center cursor-pointer">
              <Image
                quality={100}
                src={Face}
                alt={"user"}
                className="h-auto"
                width={17}
              />
            </div>
            <span className="m-2 hidden xl:block">{user?.name}</span>
            <HiOutlineChevronUp
              className={`${open ? "" : "rotate-180 transform"} m-2`}
            />
          </MenuButton>
          <Transition as={Fragment}>
            <div className="absolute top-[48px] left-0 w-full z-10">
              <TransitionChild
                enter="transition ease-out duration-500"
                enterFrom="opacity-20 -translate-y-10"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="bg-white flex flex-col absolute right-0 mt-2 w-52 p-1 rounded-lg z-10 border border-gray-200 ">
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        href="/account"
                        title={tLinks("/account")}
                        className={`p-2 hover:no-underline ${
                          focus && "bg-secondary-200"
                        }`}
                      >
                        {t("common.cuenta")}
                      </Link>
                    )}
                  </MenuItem>
                  {auth.claims.admin == true && (
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          href="/admin"
                          title={"Admin Dashboard"}
                          className={`p-2 text-secondary-500 hover:no-underline ${
                            focus && "bg-secondary-200"
                          }`}
                        >
                          Admin
                        </Link>
                      )}
                    </MenuItem>
                  )}
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        className={`p-2 hover:no-underline ${
                          focus && "bg-secondary-200"
                        }`}
                        href="mailto:info@reviucasa.com"
                        title="Email"
                      >
                        {t("common.soporte")}
                      </Link>
                    )}
                  </MenuItem>
                  <UserMenuClient />
                </MenuItems>
              </TransitionChild>
            </div>
          </Transition>
        </>
      )}
    </Menu>
  ) : (
    <div className="md:flex hidden ">
      <Link
        href="/auth/login"
        title={tLinks("/auth/login")}
        className="content-center hover:no-underline pr-8"
      >
        {t("common.logIn")}
      </Link>
      {/* <Link href="/auth/login" className="content-center hover:no-underline px-8">
        {t("common.signIn")}
      </Link> */}
      <Link
        href="/newReview"
        title={tLinks("/newReview")}
        className="btn btn-primary-500 "
      >
        {t("common.writeReview")}
      </Link>
    </div>
  );
};
