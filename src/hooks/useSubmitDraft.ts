import { SubmitHandler } from "react-hook-form";
import { useStep } from "./useStep";
import { auth } from "@/firebase/config";
import { ReviewData, updateDraft, updateDraftData } from "@/models/review";

type ReturnSubmitDraft = {
  onSubmitDraft: SubmitHandler<any>;
};

export function useSubmitDraft(formName: string): ReturnSubmitDraft {
  const { nextStepReview } = useStep();

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    console.log(data);
    try {
      await updateDraftData(
        auth.currentUser!.uid,
        formName as keyof ReviewData,
        data,
        nextStepReview
      );
    } catch (error) {
      console.log(error);
    }
  };

  return {
    onSubmitDraft: onSubmit,
  };
}
