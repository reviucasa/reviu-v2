"use client";
import { useDraft } from "@/hooks/swr/useDraft";
import { useUser } from "@/hooks/swr/useUser";
import { steps } from "@/staticData";
import {  useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Review() {
  const { draft } = useDraft();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !draft) {
      router.push("/review/address");
    }
    if (draft?.data.step) {
      router.push(
        draft.data.step > 6 ? steps[6].url : steps[draft.data.step].url
      );
    }
  }, [draft, router, user]);

  return <div></div>;
}
