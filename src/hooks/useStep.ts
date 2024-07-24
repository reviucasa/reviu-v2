import { usePathname } from "@/navigation";
import { getNextStepReview, getPositionUrlReview } from "@/helpers/stepper";
import { useDraft } from "./swr/useDraft";
import { removeLocaleFromPath } from "@/components/atoms/DropDownLanguages";

export const useStep = () => {
  const pathname = usePathname();
  const { draft } = useDraft();

  const currentUrlPosition = getPositionUrlReview(
    removeLocaleFromPath(pathname)
  );
  const nextStepReview = getNextStepReview(
    draft?.data.step || 0,
    currentUrlPosition + 1
  );

  return {
    nextStepReview,
    currentUrlPosition,
  };
};
