"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { PostModal } from "../molecules/PostModal";
import { Button } from "./Button";
import { PostPlain } from "../organism/PostView";

export const PostModalButton = ({ post }: { post: PostPlain }) => {
  const [openPostModal, setOpenPostModal] = useState<boolean>(false);
  const t = useTranslations();

  return (
    <>
      <Button
        onClick={() => setOpenPostModal(!openPostModal)}
        className="btn-primary-500"
      >
        {t("blog.readme")}
      </Button>
      <PostModal
        openModal={openPostModal}
        setOpenModal={setOpenPostModal}
        post={post}
      />
    </>
  );
};
