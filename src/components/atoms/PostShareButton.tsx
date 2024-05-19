"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { BiCheck } from "react-icons/bi";
import { PostPlain } from "../organism/PostView";
import Image from "next/image";
import Enlace from "public/images/Icon_Enlace.svg";

export function PostShareButton({ post }: { post: PostPlain }) {
  const t = useTranslations();

  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (linkCopied) {
      // Set a timer to toggle isActive back to false after 3 seconds
      timer = setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    }

    // Cleanup function to clear the timer if the component unmounts
    // or if isActive changes before the timeout completes.
    return () => clearTimeout(timer);
  }, [linkCopied]); // Only re-run this effect if isActive changes

  return (
    <div
      className={
        "flex space-x-2 justify-between px-3 rounded-lg cursor-pointer items-center hover:no-underline hover:text-primary-300"
      }
      onClick={() => {
        setLinkCopied(true);
        navigator.clipboard.writeText(
          `https://reviu.vercel.app/blog/${post.id}`
        );
      }}
    >
      {linkCopied ? (
        <BiCheck />
      ) : (
        <Image
          quality={100}
          src={Enlace}
          alt={"enlace"}
          width={26}
          height={26}
        />
      )}
      <span className="pl-1">
        {linkCopied ? t("common.copied") : t("common.compartir")}
      </span>
    </div>
  );
}
