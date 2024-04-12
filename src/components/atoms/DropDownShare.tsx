import { Menu, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Share from "public/IconShare.svg";
import ShareWhatsapp from "public/IconWhatsapp.svg";
import Enlace from "public/Icon_Enlace.svg";
import ShareTwitter from "public/ShareTwitter.svg";
import { Fragment, useEffect, useState } from "react";

export const DropDownShare = () => {
  const t = useTranslations();
  const [textShare, setTextShare] = useState("");

  useEffect(() => {
    setTextShare(
      "Echa un vistazo a las opiniones de este bloque " +
        location.href +
        " a través de " +
        location.origin
    );
  }, []);

  return (
    <Menu as="div" className="relative hidden md:block">
      <>
        <Menu.Button className="flex items-center bg-white rounded-md p-1 border w-auto">
          <span className="m-2">{t("common.compartir")}</span>
          <div className=" w-10 h-10 flex items-center justify-center cursor-pointer">
            <Image
              quality={100}
              src={Share}
              alt={"user"}
              width={17}
              height={17}
            />
          </div>
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
                  <a
                    className={`flex p-2 rounded-lg cursor-pointer items-center hover:no-underline ${
                      active && "bg-secondary-200"
                    }`}
                    href={`https://twitter.com/intent/tweet?text=${textShare}`}
                  >
                    <Image
                      quality={100}
                      src={ShareTwitter}
                      alt={"twitter"}
                      width={26}
                      height={26}
                    />
                    <span className="pl-1">{t("common.twitter")}</span>
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    className={`flex p-2 rounded-lg cursor-pointer items-center hover:no-underline ${
                      active && "bg-secondary-200"
                    }`}
                    href={`https://api.whatsapp.com/send?text=${textShare}`}
                  >
                    <Image
                      quality={100}
                      src={ShareWhatsapp}
                      alt={"whatsapp"}
                      width={26}
                      height={26}
                    />
                    <span className="pl-1">{t("common.whatsapp")}</span>
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={`flex p-2 rounded-lg cursor-pointer items-center hover:no-underline ${
                      active && "bg-secondary-200"
                    }`}
                    onClick={() => navigator.clipboard.writeText(location.href)}
                  >
                    <Image
                      quality={100}
                      src={Enlace}
                      alt={"enlace"}
                      width={26}
                      height={26}
                    />
                    <span className="pl-1">{t("common.copiarenlace")}</span>
                  </div>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition.Child>
        </Transition>
      </>
    </Menu>
  );
};
