"use client";
import { DialogDrawer } from "../atoms/DialogDrawer";
import { PostPlain, PostView } from "../organism/PostView";

export const PostModal = ({
  post,
  openModal,
  setOpenModal,
}: {
  post: PostPlain;
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}) => {
  return (
    <DialogDrawer
      iconClose
      isOpen={openModal}
      setIsOpen={setOpenModal}
      className="h-full absolute right-0 lg:w-3/4 w-full rounded-none bg-white"
    >
      <PostView post={post} />
    </DialogDrawer>
  );
};
