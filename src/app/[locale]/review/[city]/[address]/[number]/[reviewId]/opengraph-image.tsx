import { ImageResponse } from "next/og";
import { Chip } from "@/components/atoms/Chip";
import { getReview } from "@/models/review";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { getTranslations } from "next-intl/server";
import dayjs from "dayjs";
import { PiCalendarBlank, PiKey, PiMoneyLight } from "react-icons/pi";

export const runtime = "edge";

// Image metadata
export const alt = "Review details";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image({
  params: { locale, city, address, number, reviewId },
}: {
  params: {
    locale: string;
    city: string;
    address: string;
    number: string;
    reviewId: string;
  };
}) {
  const t = await getTranslations("common");

  const review = await getReview(reviewId);

  const ActualYear = dayjs().year();
  const EndYear = Number(review?.data?.stay?.endYear);
  const StartYear = Number(review?.data?.stay?.startYear);
  const diffYear = EndYear ? EndYear - StartYear : ActualYear - StartYear;

  const startPrice = Number(review?.data?.stay?.startPrice);
  const endPrice = Number(review?.data?.stay?.endPrice);
  const priceChange = endPrice != startPrice;

  const string = diffYear === 1 ? t("añoVar") : t("añosVar");

  // const addr = decodeURIComponent(address.replaceAll("-", " "));

  return new ImageResponse(
    (
      <div className=" border border-gray-300 rounded-md ">
        <Chip
          className={`flex  text-xs rounded-none items-center gap-3 h-10 ${
            review?.data?.opinion?.recomend
              ? "bg-lime text-primary-500"
              : "bg-red-500 text-white"
          }`}
        >
          {review?.data?.opinion?.recomend ? (
            <FaRegThumbsUp size={17} />
          ) : (
            <FaRegThumbsDown size={17} />
          )}
          {review?.data?.opinion?.recomend
            ? t("loRecomiendo")
            : t("noLoRecomiendo")}
        </Chip>
        <div className="mt-0  p-4 overflow-hidden sticky top-10">
          <div className=" top-5 grid grid-cols-[1fr_auto]">
            <div className={"flex flex-col  gap-2 "}>
              <span className="font-bold text-sm ">
                {review?.apartment?.stair} {review?.apartment?.floor}{" "}
                {review?.apartment?.door}
                <p className="text-xs  font-normal flex ">
                  {review?.address.split(",").slice(0, 2).join(" ")}
                </p>
                <p className="text-xs font-normal flex ">Barcelona</p>
              </span>
              <div className="flex items-center">
                <div className="flex w-5 h-5">
                  <PiMoneyLight size={20} color="#546E7A" />
                </div>
                <p className="text-neutral-400 ml-2 text-xs  ">
                  {EndYear
                    ? !priceChange
                      ? t("price") +
                        " " +
                        review?.data.stay?.startPrice +
                        "€"
                      : t("startPrice") +
                        " " +
                        review?.data.stay?.startPrice +
                        "€ - " +
                        t("endPrice") +
                        " " +
                        review?.data.stay?.endPrice +
                        "€"
                    : t("price") +
                      " " +
                      review?.data.stay?.startPrice +
                      "€"}
                </p>
              </div>
              <div className="flex items-center">
                <div className="flex w-5 h-5">
                  <PiKey size={20} color="#546E7A" />
                </div>
                {EndYear ? (
                  <p className="text-neutral-400 ml-2 text-xs  ">
                    {t("livedFrom")} {StartYear} {t("until")}{" "}
                    {EndYear}
                  </p>
                ) : (
                  <p className="text-neutral-400 ml-2 text-xs  ">
                    {t("movedIn")} {StartYear}
                  </p>
                )}
              </div>
              <div className="flex items-center">
                <div className="flex w-5 h-5">
                  <PiCalendarBlank size={20} color="#546E7A" />
                </div>
                {EndYear ? (
                  <p className="text-neutral-400 ml-2 text-xs  ">
                    {t("havivido")} {diffYear} {string}{" "}
                    {t("enEsaDireccion")}
                  </p>
                ) : (
                  <p className="text-neutral-400 ml-2 text-xs">
                    {t("masDe")} {diffYear} {t("añosViviendo")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
