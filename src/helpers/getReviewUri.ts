import { Review } from "@/models/review";

export function getReviewUri(review: Review): string {
  const l = review.location!;
  return `/review/${l.province}/${l.municipality}/${l.type}/${l.street}/${l.number}/${review.id}`;
}
