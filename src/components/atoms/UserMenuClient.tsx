"use client";

import { MenuItem } from "@headlessui/react";
import { useRouter, usePathname } from "@/navigation";
import { mutate } from "swr";
import { signOut } from "@/firebase/auth";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

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

    pathname.includes("/newReview")
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
