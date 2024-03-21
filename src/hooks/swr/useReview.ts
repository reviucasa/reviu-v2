import { auth } from "@/firebase/config";
import { Review, getReview } from "@/models/review";
import { useQuery } from "@tanstack/react-query";

const useReview = () => {
  const queryFn = async (): Promise<Review | undefined> => {
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
  } = useQuery<Review | undefined, Error>(queryOptions);

  return { review, isLoading, refreshReview: () => refetch() };
};

export { useReview };
