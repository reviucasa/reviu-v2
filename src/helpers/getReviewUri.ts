import { Review } from "@/models/review";
import { cleanAddress } from "./addressFunctions";

export function getReviewUri(review: Review): string {
  const l = review.location!;
  const addr = cleanAddress(review.address);
  return `/review/${l.province.toLowerCase()}/${l.municipality.toLowerCase()}/${addr?.street.toLowerCase()}/${
    l.number
  }/${review.id}`;
}
