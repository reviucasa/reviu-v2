import Image from "next/image";
import { ReviewImage } from "@/models/review";
import { Modal } from "../atoms/Modal";

export const DialogImage = ({
  isOpen,
  setIsOpen,
  image,
}: {
  isOpen: boolean;
  setIsOpen?: any;
  image?: ReviewImage;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={() => {
        setIsOpen(!isOpen);
      }}
    >
      {image && (
        <div className="flex flex-col relative text-center justify-center items-center">
          <Image
            src={image.url}
            width={700}
            height={700}
            className=" bg-zinc-950 object-contain w-[100vw] h-auto max-h-[640px] "
            alt="selected image"
          />
          <p className="absolute font-semibold bg-white rounded-md bottom-8 px-4 py-2 max-w-80">
            {image.caption}
          </p>
        </div>
      )}
    </Modal>
  );
};
