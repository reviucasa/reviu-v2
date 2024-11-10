"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyEmailLinkAndAuthenticate } from "@/firebase/auth";
import { useTranslations } from "next-intl";

export default function AuthCheck() {
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    const handleVerify = async () => {
      const credentials = await verifyEmailLinkAndAuthenticate(t);
      if (credentials && credentials.user.displayName === null) {
        router.replace("/auth/register");
      }
    };

    handleVerify();
  }, [router, t]);

  return null;
}
