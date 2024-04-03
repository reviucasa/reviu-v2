import { SubmitHandler } from "react-hook-form";
import { useStep } from "./useStep";
import { auth } from "@/firebase/config";
import {
  ReviewData,
  publishReview,
  updateDraft,
  updateDraftData,
} from "@/models/review";
import { useDraft } from "./swr/useDraft";

type ReturnSubmitDraft = {
  onSubmitDraft: SubmitHandler<any>;
};

export function useSubmitDraft(formName: string): ReturnSubmitDraft {
  const { nextStepReview } = useStep();

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    const cleanedData = removeUndefinedValues(data);
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

type GenericObject = { [key: string]: any };

export function removeUndefinedValues(obj: GenericObject): GenericObject {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object")
      removeUndefinedValues(obj[key]);
    else if (obj[key] === undefined) delete obj[key];
  });
  return obj;
}
