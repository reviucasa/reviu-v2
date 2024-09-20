import { ImageResponse } from "next/og";
import { Chip } from "@/components/atoms/Chip";
import { getReview } from "@/models/review";
import { getTranslations } from "next-intl/server";
import thumbUp from "public/images/thumbUp.svg";
import thumbDown from "public/images/thumbDown.svg";
import NextImage from "next/image";
export const runtime = "edge";

// Image metadata
export const alt = "Review details";
export const size = {
  width: 600,
  height: 315,
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

  return new ImageResponse(
    (
      <div>
        <div className="flex items-start w-full justify-between pb-4 mb-4 border-b-2 gap-6">
          <div className="flex-1 flex flex-col  items-start justify-center ">
            <p>{review?.address}</p>
            <p className="font-bold">
              {review?.apartment?.stair} {review?.apartment?.floor}{" "}
              {review?.apartment?.door}
            </p>
          </div>
          <Chip
            className={`h-10 w-10 px-2 py-2 ${
              review?.data?.opinion?.recomend
                ? "bg-lime text-primary-500"
                : "bg-red-500 text-white"
            }`}
          >
            {review?.data?.opinion?.recomend ? (
              <NextImage src={thumbUp} width={20} height={20} alt="thumbUp" />
            ) : (
              <NextImage
                src={thumbDown}
                width={20}
                height={20}
                alt="thumbDown"
              />
            )}
          </Chip>
        </div>
        <div className="flex pb-4 justify-start">
          <p className="font-bold text-xl text-ellipsis	">
            {review?.data?.opinion?.title}
          </p>
        </div>
        <div className="flex flex-row justify-start h-20 w-full gap-2">
          {review?.data.opinion?.images &&
            review.data.opinion?.images
              .slice(0, 4)
              .map((image, idx) => (
                <NextImage
                  key={idx}
                  id={`image-preview-${idx}`}
                  src={image.url}
                  width={80}
                  height={80}
                  className="rounded-md object-cover border border-gray-200 w-12 h-20"
                  alt="selected image"
                />
              ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

/* <div className=" border border-gray-300 rounded-md ">
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
                      ? t("price") + " " + review?.data.stay?.startPrice + "€"
                      : t("startPrice") +
                        " " +
                        review?.data.stay?.startPrice +
                        "€ - " +
                        t("endPrice") +
                        " " +
                        review?.data.stay?.endPrice +
                        "€"
                    : t("price") + " " + review?.data.stay?.startPrice + "€"}
                </p>
              </div>
              <div className="flex items-center">
                <div className="flex w-5 h-5">
                  <PiKey size={20} color="#546E7A" />
                </div>
                {EndYear ? (
                  <p className="text-neutral-400 ml-2 text-xs  ">
                    {t("livedFrom")} {StartYear} {t("until")} {EndYear}
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
                    {t("havivido")} {diffYear} {string} {t("enEsaDireccion")}
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
      </div> */
