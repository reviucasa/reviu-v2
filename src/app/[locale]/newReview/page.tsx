"use client";
import { useDraft } from "@/hooks/swr/useDraft";
import { useUser } from "@/hooks/swr/useUser";
import { steps } from "@/staticData";
import { useRouter } from "@/navigation";
import { useEffect } from "react";

export default function Review() {
  const { draft } = useDraft();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user) {
        if (!draft) {
          router.push("/newReview/address");
        }
        if (draft?.data.step) {
          router.push(
            draft.data.step > steps.length - 1
              ? steps[steps.length - 1].url
              : steps[draft.data.step].url
          );
        }
      } else {
        router.push("/auth/login");
      }
    }, 500); // 500 ms delay

    return () => clearTimeout(timeout); // Cleanup the timeout on unmount
  }, [draft, router, user]);

  return <div></div>;
}
