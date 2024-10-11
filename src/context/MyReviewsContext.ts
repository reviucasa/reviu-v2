import { Building } from "@/models/building";
import { Review } from "@/models/review";
import { createContext } from "react";

type ReviewsContextType = {
  reviews: Array<Review>;
  buildings: Array<Building | undefined>;
};

export const MyReviewsContext = createContext<ReviewsContextType>({
  reviews: [],
  buildings: [],
});
