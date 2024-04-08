import Image from "next/image";
import { useState } from "react";
import IconAcoso from "../../../public/IconAcoso.svg";
import IconAcosoRed from "../../../public/IconAcosoRed.svg";
import IconFireRed from "../../../public/IconFireRed.png";
import IconInfoFalse from "../../../public/IconInfoFalse.svg";
import IconInfoFalseRed from "../../../public/IconInfoFalseRed.png";
import IconSpam from "../../../public/IconSpam.svg";
import IconSpamRed from "../../../public/IconSpamRed.png";
import backArrow from "../../../public/backArrow.png";
import IconFire from "../../../public/iconFire.svg";
import { Button } from "../atoms/Button";
import { Dialog } from "../atoms/Dialog";
import { useTranslations } from "next-intl";
import { ReviewReport, createReviewReport } from "@/models/report";
import { auth } from "@/firebase/config";
import { useUser } from "@/hooks/swr/useUser";
import { ReviewImage } from "@/models/review";
import { DialogToReport } from "../atoms/DialogToReport";
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
      <div className="px-4">
        {image && (
          <div className="flex flex-col relative text-center">
            <Image
              src={image.url}
              width={700}
              height={700}
              className="rounded-lg object-contain w-full h-auto max-h-[512px] mb-4 lg:mb-8"
              alt="selected image"
            />
            <p className="font-semibold">{image.caption}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
