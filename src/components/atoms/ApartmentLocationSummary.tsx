import { Review } from "@/models/review";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { PiCalendarBlank, PiKey, PiMoneyLight } from "react-icons/pi";

export const ApartmentLocationSummary = ({
  className,
  review,
}: {
  className?: string;
  review: Review;
}) => {
  const ActualYear = dayjs().year();
  const EndYear = Number(review?.data?.stay?.endYear);
  const StartYear = Number(review?.data?.stay?.startYear);
  const diffYear = EndYear ? EndYear - StartYear : ActualYear - StartYear;

  const startPrice = Number(review?.data?.stay?.startPrice);
  const endPrice = Number(review?.data?.stay?.endPrice);
  const priceChange = endPrice != startPrice;

  const t = useTranslations();

  return (
    <div className={className}>
      <span className="font-bold text-sm ">
        {review?.apartment?.stair} {review?.apartment?.floor}{" "}
        {review?.apartment?.door}
        <p className="text-sm font-normal flex !my-1">
          {review.address.split(",").slice(0, 2).join(" ")}, Barcelona
        </p>
      </span>
      <div className="flex justify-start space-x-4 items-center mt-2 ">
        <div className="flex items-center">
          <div className="flex w-4 h-4">
            <PiMoneyLight size={16} color="#546E7A" />
          </div>
          <p className="text-neutral-400 text-xs !my-0 !ml-2">
            {EndYear
              ? !priceChange
                ? t("common.price") + " " + review.data.stay?.startPrice + "€"
                : t("common.startPrice") +
                  " " +
                  review.data.stay?.startPrice +
                  "€ - " +
                  t("common.endPrice") +
                  " " +
                  review.data.stay?.endPrice +
                  "€"
              : t("common.price") + " " + review.data.stay?.startPrice + "€"}
          </p>
        </div>
        <div className="flex items-center">
          <div className="flex w-4 h-4">
            <PiCalendarBlank size={16} color="#546E7A" />
          </div>
          {EndYear ? (
            <p className="text-neutral-400  text-xs  !my-0 !ml-2">
              {t("common.from")} {StartYear} {t("common.until")} {EndYear}
            </p>
          ) : (
            <p className="text-neutral-400 text-xs  !my-0 !ml-2 ">
              {t("common.movedIn")} {StartYear}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
