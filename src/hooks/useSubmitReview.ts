import { SubmitHandler } from "react-hook-form";
import { useStep } from "./useStep";
import { auth } from "@/firebase/config";
import { updateDraft, updateReview } from "@/models/review";
import { removeUndefinedValues } from "./useSubmitDraft";

type ReturnSubmitReview = {
  onSubmitReview: SubmitHandler<any>;
};

export function useSubmitReview(formName: string): ReturnSubmitReview {
  const { nextStepReview } = useStep();

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    const cleanedData = removeUndefinedValues(data);
    try {
      await updateReview(auth.currentUser!.uid, {
        data: { [formName]: cleanedData, step: nextStepReview },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    onSubmitReview: onSubmit,
  };
}
