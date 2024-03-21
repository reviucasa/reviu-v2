import { useRouter } from "next/router";
import { useReview } from "./swr/useReview";
import { getNextStepReview, getPositionUrlReview } from "@/helpers/stepper";

export const useStep = () => {
  const router = useRouter();
  const { review } = useReview();

  const currentUrlPosition = getPositionUrlReview(router.pathname);
  const nextStepReview = getNextStepReview(
    review?.data.step || 0,
    currentUrlPosition + 1
  );

  return {
    nextStepReview,
    currentUrlPosition,
  };
};
