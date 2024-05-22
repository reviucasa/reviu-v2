import Image from "next/image";
import { ReviewImage } from "@/models/review";
import { Modal } from "../atoms/Modal";
import { Button } from "../atoms/Button";
import { useEffect, useState } from "react";
import arrowLeft from "public/images/arrowLeft.svg";
import arrowRigth from "public/images/arrowRigth.svg";

export const DialogImage = ({
  isOpen,
  setIsOpen,
  images,
  index,
}: {
  isOpen: boolean;
  setIsOpen?: any;
  images?: ReviewImage[];
  index: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(index);

  useEffect(() => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  }, [index]);

  const handleNextReviews = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };
  const handlePrevReviews = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={() => {
        setIsOpen(!isOpen);
      }}
    >
      {images && (
        <div className="flex relative text-center justify-center items-center bg-zinc-950 px-8 rounded-xl gap-8">
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
          <div>
            <Image
              src={images[currentIndex].url}
              width={700}
              height={700}
              className="object-contain w-full h-[90vh] "
              alt="selected image"
            />
            {images[currentIndex].caption != "" && (
              <p className="absolute font-semibold bg-white rounded-md bottom-8 px-4 py-2 max-w-80">
                {images[currentIndex].caption}
              </p>
            )}
          </div>
          <Button
            onClick={handleNextReviews}
            disabled={currentIndex == images.length - 1}
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
      )}
    </Modal>
  );
};
