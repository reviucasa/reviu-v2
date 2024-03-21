"use client";
import { useReview } from "@/hooks/swr/useReview";
import { useUser } from "@/hooks/swr/useUser";
import { steps } from "@/staticData";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Review() {
  const { review } = useReview();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !review /* && !draft_review */) {
      router.push("/review/address");
    }
    /* revalidateUser(); */
    if (review?.data.step) {
      router.push(steps[review.data.step].url);
    }
  }, [review, router, user]);

  return <div></div>;
}
