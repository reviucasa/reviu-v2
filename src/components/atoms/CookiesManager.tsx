"use client";

import { useEffect, useState } from "react";
import { CookiesDialog } from "@/components/dialogs/CookiesDialog";

export default function CookiesManager() {
  const [isOpenCookie, setIsOpenCookie] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("acceptedCookies");
    if (!hasAccepted) {
      setIsOpenCookie(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("acceptedCookies", "true");
    setIsOpenCookie(false);
  };

  return (
    <CookiesDialog
      isOpen={isOpenCookie}
      setIsOpen={setIsOpenCookie}
      acceptText={"Accept"}
      description={
        "By continuing to browse this website, you accept the use of both our own and third-party cookies for analytical purposes. For more information, please read our Cookie Policy."
      }
      title={"We use cookies"}
      onAccept={handleAccept}
    />
  );
}
