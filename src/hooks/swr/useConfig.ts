import { Config } from "@/models/types";
import { useSWRConfig } from "swr";
import useSWRImmutable from "swr/immutable";

// const fetcher = (url: string): Promise<Config> => axiosInstance.get(url).then((res: AxiosResponse<Config>) => res.data)

export const useConfig = () => {
  const { mutate } = useSWRConfig();
  const data: Config | undefined = undefined; // {data} = useSWRImmutable('/reviews/config', fetcher)

  const handleForceRefresh = () => {
    mutate("/reviews/config");
  };

  return {
    config: data, //data?.reviewConfig,
    configForceRefresh: handleForceRefresh,
  };
};
