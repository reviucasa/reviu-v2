"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyEmailLinkAndAuthenticate } from "@/firebase/auth";

export default function AuthCheck() {
  const router = useRouter();

  useEffect(() => {
    const handleVerify = async () => {
      const credentials = await verifyEmailLinkAndAuthenticate();
      if (credentials && credentials.user.displayName === null) {
        router.replace("/auth/register");
      }
    };

    handleVerify();
  }, [router]);

  return null;
}
