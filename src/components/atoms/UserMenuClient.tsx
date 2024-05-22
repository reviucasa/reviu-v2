"use client";

import { Menu, MenuItem } from "@headlessui/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { mutate } from "swr";
import { signOut } from "@/firebase/auth";
import { useTranslations } from "next-intl";

const UserMenuClient = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const t = useTranslations();

  const handleSignOut = async () => {
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
  };

  return (
    <MenuItem>
      {({ focus }) => (
        <span
          className={`p-2 cursor-pointer ${focus && "bg-secondary-200"}`}
          onClick={handleSignOut}
        >
          {t("common.cerrarSesión")}
        </span>
      )}
    </MenuItem>
  );
};

export default UserMenuClient;
