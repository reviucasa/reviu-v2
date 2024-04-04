import { CommunityCard } from "@/components/molecules/CommunityCard";
import { Review } from "@/models/review";
import { useTranslations } from "next-intl";

type CommunityValuation = {
  reviews: Array<Review>;
};

export const CommunityValuation = ({ reviews }: CommunityValuation) => {
  const t = useTranslations();
  // draw review information in boxes
  return (
    <div>
      <h5>
        {t(
          "communityValuations.communityValuations",
        )}
      </h5>
      <p>
        {reviews.length} {t("common.reviews", )}
      </p>
      {reviews.map((review) => (
        <CommunityCard className="my-6" key={review.id} review={review} />
      ))}
    </div>
  );
};
