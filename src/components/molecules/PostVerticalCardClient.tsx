"use client";
import { useState } from "react";
import { PostModal } from "./PostModal";
import { useTranslations } from "use-intl";
import { PostPlain } from "../organism/PostView";

interface PostVerticalCardClientProps {
  post: PostPlain;
}

export default function PostVerticalCardClient({
  post,
}: PostVerticalCardClientProps) {
  const t = useTranslations();
  const [openPostModal, setOpenPostModal] = useState<boolean>(false);

  return (
    <>
      <div
        onClick={() => setOpenPostModal(!openPostModal)}
        className="text-primary-500 underline cursor-pointer hover:text-primary-300"
      >
        {t("common.verMás")}
      </div>
      <PostModal
        openModal={openPostModal}
        setOpenModal={setOpenPostModal}
        post={post}
      />
    </>
  );
}
