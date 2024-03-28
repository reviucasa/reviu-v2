"use client";
import { useDraft } from "@/hooks/swr/useDraft";
import { useUser } from "@/hooks/swr/useUser";
import { steps } from "@/staticData";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Review() {
  const { draft } = useDraft();
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    /* if (isFromReview) {
      // If the user comes from a '/review' path, redirect them to the home page
      router.push("/");
      return; // Prevent further execution after redirection
    } */

    if (user && !draft /* && !draft_review */) {
      router.push("/review/address");
    }
    /* revalidateUser(); */
    if (draft?.data.step) {
      router.push(steps[draft.data.step].url);
    }
  }, [draft, router, user]);

  return <div></div>;
}
