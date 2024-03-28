import { usePathname } from "next/navigation";
import { getNextStepReview, getPositionUrlReview } from "@/helpers/stepper";
import { useDraft } from "./swr/useDraft";

export const useStep = () => {
  const pathname = usePathname();
  const { draft } = useDraft();

  const currentUrlPosition = getPositionUrlReview(pathname);
  const nextStepReview = getNextStepReview(
    draft?.data.step || 0,
    currentUrlPosition + 1
  );

  return {
    nextStepReview,
    currentUrlPosition,
  };
};
