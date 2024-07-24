"use client";
import { useAuth } from "@/context/auth";
import { PostStatus, updatePost, deletePost } from "@/models/post";
import { useState, useEffect } from "react";
import { BiHide, BiShow, BiTrash } from "react-icons/bi";
import { PostPlain } from "../organism/PostView";
import { useRouter } from "@/navigation";

export default function PostViewActions({ post }: { post: PostPlain }) {
  const { claims } = useAuth();
  const router = useRouter();
  const [statusActive, setStatusActive] = useState(
    post.status != PostStatus.archived
  );
  const [linkCopied, setLinkCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (linkCopied) {
      const timer = setTimeout(() => {
        setLinkCopied(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [linkCopied]);

  const handleToggleStatus = async () => {
    const newStatus = statusActive ? PostStatus.archived : PostStatus.active;
    await updatePost(post.id, { status: newStatus });
    setStatusActive(!statusActive);
    router.refresh();
  };

  const handleDelete = async () => {
    if (confirmDelete) {
      await deletePost(post.id);
      router.refresh();
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <>
      {claims?.admin && (
        <div className="flex flex-row justify-end space-x-6 pt-8 border-t-2 border-gray-100">
          <button
            className="flex gap-2 items-center bg-white rounded-lg p-2 border w-auto h-full hover:bg-gray-100 hover:border-gray-500"
            onClick={handleToggleStatus}
          >
            <div className="w-5 h-5 flex items-center justify-center cursor-pointer text-gray-500 ">
              {statusActive ? <BiHide /> : <BiShow />}
            </div>
            <span className="text-sm pr-2">
              {statusActive ? "Hide" : "Show"}
            </span>
          </button>
          <button
            className="flex gap-2 items-center bg-white rounded-lg p-2 border border-red-200 w-auto h-full hover:bg-red-100 hover:border-red-500"
            onClick={handleDelete}
          >
            <div className="w-5 h-5 flex items-center justify-center cursor-pointer text-red-500 ">
              <BiTrash />
            </div>
            <span className="text-sm pr-2">
              {confirmDelete ? "Confirm" : "Delete"}
            </span>
          </button>
        </div>
      )}
    </>
  );
}
