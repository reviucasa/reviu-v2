import { auth } from "@/firebase/config";
import { Review, getDraft, getReview } from "@/models/review";
import { useQuery } from "@tanstack/react-query";

const useDraft = () => {
  const queryFn = async (): Promise<Review | undefined> => {
    return getDraft(auth.currentUser!.uid);
  };

  const queryOptions = {
    queryKey: ["draft", auth.currentUser?.uid],
    queryFn,
  };

  const {
    data: draft,
    isLoading,
    refetch,
  } = useQuery<Review | undefined, Error>(queryOptions);

  return { draft, isLoading, refreshDraft: () => refetch() };
};

export { useDraft };
