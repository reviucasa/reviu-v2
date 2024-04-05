import { Review } from "@/models/review";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { PiCalendarBlank, PiMoneyLight } from "react-icons/pi";

export const ApartmentLocation = ({
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

  const string = diffYear === 1 ? t("common.añoVar") : t("common.añosVar");

  return (
    <div className={className}>
      <span className="font-bold text-sm md:text-base">
        {review?.apartment?.stair} {review?.apartment?.floor}{" "}
        {review?.apartment?.door}
        <p className="text-xs md:text-base font-normal flex ">
          {review.address.split(",").slice(0, 2).join(" ")}
        </p>
        <p className="text-xs md:text-base font-normal flex ">Barcelona</p>
      </span>
      <div className="flex items-center">
        <div className="flex w-5 h-5">
          <PiMoneyLight size={20} color="#546E7A" />
        </div>
        <p className="text-neutral-400 ml-2 text-xs md:text-sm ">
          {!priceChange
            ? t("common.price") + " " + review.data.stay?.startPrice + "€"
            : t("common.startPrice") +
              " " +
              review.data.stay?.startPrice +
              "€ - " +
              t("common.endPrice") +
              " " +
              review.data.stay?.endPrice +
              "€"}
        </p>
      </div>
      <div className="flex items-center">
        <div className="flex w-5 h-5">
          <PiCalendarBlank size={20} color="#546E7A" />
        </div>
        {EndYear ? (
          <p className="text-neutral-400 ml-2 text-xs md:text-sm ">
            {t("common.havivido")} {diffYear} {string}{" "}
            {t("common.enEsaDireccion")}
          </p>
        ) : (
          <p className="text-neutral-400 ml-2 text-xs md:text-sm ">
            {t("common.masDe")} {diffYear} {t("common.añosViviendo")}
          </p>
        )}
      </div>
    </div>
  );
};
