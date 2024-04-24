"use client";
import {
  Post,
  PostStatus,
  deletePost,
  getPosts,
  updatePost,
} from "@/models/post";
import Image from "next/image";
import { formatFirebaseTimestamp } from "../../helpers/formatTimestamp";
import Enlace from "public/Icon_Enlace.svg";
import Share from "public/IconShare.svg";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { BiCheck, BiHide, BiShow, BiTrash } from "react-icons/bi";
import { useAuth } from "@/context/auth";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { classNames } from "@/helpers/classNames";
import { normalizeString } from "@/helpers/normalizeString";

export const PostView = ({ post }: { post: Post }) => {
  const { claims } = useAuth();
  const router = useRouter();
  const [statusActive, setStatusActive] = useState(
    post.status != PostStatus.archived
  );
  const [linkCopied, setLinkCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const t = useTranslations();

  const { refetch } = useQuery<Post[] | undefined, Error>({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

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
    <div className=" bg-white  ">
      <div
        className={classNames(
          statusActive ? "opacity-100" : "opacity-40",
          "flex flex-col space-y-10 p-4 md:p-10"
        )}
      >
        <h2 className="text-4xl font-bold text-gray-900 ">{post.title}</h2>
        <div className="flex justify-between items-end">
          <p className="text-xs text-gray-400 ">
            {formatFirebaseTimestamp(post.timeCreated)}
          </p>
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
        </div>
        <p className=" text-gray-600 ">{post.subtitle}</p>
        <Image
          src={post.imageUrl}
          className="w-full max-h-96 object-cover max-w-3xl mx-auto rounded-xl"
          width={600}
          height={600}
          alt="PostImage"
        />
        <div
          className="text-gray-900"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
      {claims?.admin == true && (
        <div className="flex flex-row justify-end space-x-6 pt-8 border-t-2 border-gray-100">
          <button
            className="flex gap-2 items-center bg-white rounded-lg p-2 border w-auto h-full hover:bg-gray-100 hover:border-gray-500"
            onClick={async () => {
              //archive post
              if (statusActive) {
                await updatePost(post.id, { status: PostStatus.archived });
                setStatusActive(false);
              } else {
                await updatePost(post.id, { status: PostStatus.active });
                setStatusActive(true);
              }
              refetch();
            }}
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
            onClick={async () => {
              //delete post
              if (confirmDelete) {
                await deletePost(post.id);
                refetch();
                router.refresh();
              } else {
                setConfirmDelete(true);
              }
            }}
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

      {/* <p className=" text-gray-900 ">{post.content}</p> */}
    </div>
  );
};
