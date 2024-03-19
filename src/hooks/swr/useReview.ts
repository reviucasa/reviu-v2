import { auth } from "@/firebase/config";
import { ReviewData, getReview } from "@/models/review";
import { ReviewRequest } from "@/models/types";
import { useQuery } from "@tanstack/react-query";
import useSWR, { useSWRConfig } from "swr";
import useSWRImmutable from "swr/immutable";

const useReview = () => {
  const queryFn = async (): Promise<ReviewData | undefined> => {
    return getReview(auth.currentUser!.uid);
  };

  const queryOptions = {
    queryKey: ["review", auth.currentUser?.uid],
    queryFn,
  };

  const {
    data: review,
    isLoading,
    refetch,
  } = useQuery<ReviewData | undefined, Error>(queryOptions);

  return { review, isLoading, refreshReview: () => refetch() };
};

export { useReview };
