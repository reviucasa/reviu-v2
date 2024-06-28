"use client";
import { Idioms } from "@/staticData";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";

export const DropDownLanguages = () => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const currentLanguage = locale || "es";

  return (
    <Menu as="div" className="relative max-w-[168px]">
      <div>
        <MenuButton className="flex items-center bg-white rounded-lg p-1 border w-auto">
          <span className="text-gray-800 m-2">
            {Idioms.find((idiom) => idiom.code === currentLanguage)?.label}
          </span>
          <HiOutlineChevronDown className={`text-gray-800  m-2`} />
        </MenuButton>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="bg-white flex flex-col absolute right-0 -top-36 w-28 mb-2 p-1 rounded-lg z-10 border border-gray-200 ">
          {Idioms.map((idiom, i) => (
            <MenuItem key={i}>
              {({ focus }) => (
                <Link
                  className={`text-gray-800 p-2 cursor-pointer ${
                    focus && "bg-secondary-200"
                  }`}
                  href={`/${idiom.code}/${pathname}`}
                  hrefLang={idiom.code}
                  /* title={tLinks(pathname)} */
                  onClick={() => router.refresh()}
                >
                  {t(`common.${idiom.label}`)}
                </Link>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
};
