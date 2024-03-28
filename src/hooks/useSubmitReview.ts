import { SubmitHandler } from "react-hook-form";
import { useStep } from "./useStep";
import { auth } from "@/firebase/config";
import { updateDraft, updateReview } from "@/models/review";

type ReturnSubmitReview = {
  onSubmitReview: SubmitHandler<any>;
};

export function useSubmitReview(formName: string): ReturnSubmitReview {
  const { nextStepReview } = useStep();

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    console.log(data);
    try {
      await updateReview(auth.currentUser!.uid, {
        data: { [formName]: data, step: nextStepReview },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    onSubmitReview: onSubmit,
  };
}
