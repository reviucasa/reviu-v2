import { auth } from "@/firebase/config";
import { User, getUser } from "@/models/user";
import { useQuery } from "@tanstack/react-query";

const useUser = () => {
  const queryFn = async (): Promise<User | undefined> => {
    return getUser(auth.currentUser!.uid);
  };

  const queryOptions = {
    queryKey: ["user", auth.currentUser?.uid],
    queryFn,
  };

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<User | undefined, Error>(queryOptions);

  return { user, isLoading, refreshUser: () => refetch() };
};

export { useUser };
