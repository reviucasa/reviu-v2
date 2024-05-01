import { shuffle } from "lodash";
import debounce from "lodash.debounce";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import arrowLeft from "public/arrowLeft.svg";
import arrowRigth from "public/arrowRigth.svg";
import { Button } from "../atoms/Button";
import { OpinionCardSmall } from "../molecules/OpinionCardSmall";
import { Review } from "@/models/review";

export const SlideReview = ({
  title,
  reviews,
  sizeCard,
  sizeGapCard,
  sizeGapCardMobile,
}: {
  title: string;
  reviews: Review[];
  sizeCard: number;
  sizeGapCard: number;
  sizeGapCardMobile: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [sizeScreen, setSizeScreen] = useState<number>(0);

  const wrapperRef = useRef<any>();

  const memoizedValues = useMemo(() => {
    //Cuanto se me mueve el slide
    let sizeTransitionCard = sizeCard + sizeGapCard;
    let mobileSizeCard = undefined;
    let leftSlidePosition = 0;

    //El tamaño del wrapper sin tener en cuenta los margenes
    const widthWrapper = wrapperRef.current?.offsetWidth;
    const preCalculatedNumberOfCards = Math.trunc(
      widthWrapper / (sizeCard + sizeGapCard)
    );
    const numberOfCards =
      preCalculatedNumberOfCards < 1 ? 1 : preCalculatedNumberOfCards;
    let windowWidth = numberOfCards * (sizeCard + sizeGapCard) - sizeGapCard;
    if (numberOfCards === 1) {
      //Mobile mode
      windowWidth = widthWrapper;
      mobileSizeCard = windowWidth - sizeGapCardMobile * 2 - windowWidth * 0.1;
      sizeTransitionCard = mobileSizeCard + sizeGapCardMobile;
      leftSlidePosition =
        windowWidth - mobileSizeCard - (sizeGapCardMobile + windowWidth * 0.05);
    }

    return {
      sizeTransitionCard,
      windowWidth,
      mobileSizeCard,
      leftSlidePosition,
      numberOfCards,
    };
  }, [sizeCard, sizeGapCard, sizeScreen, wrapperRef.current]);

  const {
    sizeTransitionCard,
    windowWidth,
    mobileSizeCard,
    leftSlidePosition,
    numberOfCards,
  } = memoizedValues;

  useEffect(() => {
    const handleResize = () => setSizeScreen(window.innerWidth);
    window.addEventListener("resize", debounce(handleResize, 200));
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shuffleData = useMemo(() => {
    return reviews && shuffle(reviews);
  }, [reviews]);

  const handleNextReviews = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };
  const handlePrevReviews = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };
  return (
    <div className="flex flex-col md:items-center">
      <div className="flex justify-center mb-10">
        <h2 className="text-2xl lg:text-[40px]">{title}</h2>
      </div>
      <div ref={wrapperRef} id="wrapper" className="w-full flex justify-center">
        <div
          id="window"
          className="flex justify-start overflow-hidden"
          style={{
            width: `${windowWidth}px`,
          }}
        >
          <div
            style={{
              transform: `translate(${
                currentIndex * -sizeTransitionCard + leftSlidePosition
              }px)`,
              gap: `${
                mobileSizeCard && mobileSizeCard !== 0
                  ? sizeGapCardMobile
                  : sizeGapCard
              }px`,
            }}
            className={`flex justify-center  transition-transform duration-700	`}
          >
            {shuffleData?.map((review: Review) => (
              <OpinionCardSmall
                key={review.id}
                review={review}
                sizeCard={
                  mobileSizeCard && mobileSizeCard !== 0
                    ? mobileSizeCard
                    : sizeCard
                }
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-10">
        <Button
          onClick={handlePrevReviews}
          disabled={currentIndex === 0}
          className="flex justify-center w-[72px] h-[40px]"
          buttonClassName="btn-secondary-300 button w-[72px] h-[40px] rounded-[40px]"
        >
          <Image
            quality={100}
            width={6}
            height={10}
            src={arrowLeft}
            alt="flecha izquierda"
          />
        </Button>
        <Button
          onClick={handleNextReviews}
          disabled={currentIndex + numberOfCards >= reviews.length}
          className="flex justify-center w-[72px] h-[40px]"
          buttonClassName="btn-secondary-300 button w-[72px] h-[40px] rounded-[40px]"
        >
          <Image
            quality={100}
            width={6}
            height={10}
            src={arrowRigth}
            alt="flecha derecha"
          />
        </Button>
      </div>
    </div>
  );
};
