"use client";
import Image from "next/image";
import circulosection from "public/circulosection.svg";
import { FaqUnit } from "../atoms/FaqUnit";
import { useTranslations } from "next-intl";
interface PropsFaq {
  question: string;
  answer: string;
}

export function SectionFaq({
  className,
  withTitle = true,
}: {
  className?: string;
  withTitle?: boolean;
}) {
  const t = useTranslations();
  const datosFaq = [
    {
      question: t("faq.whatIsHomeReview"),
      answer: t("faq.answerWhat"),
    },
    {
      question: t("faq.whyReview"),
      answer: t("faq.answerReview"),
    },
    {
      question: t("faq.anonymousReview"),
      answer: t("faq.answerAnonymous"),
    },
    {
      question: t("faq.landlordReview"),
      answer: t("faq.answerLandlord"),
    },
    {
      question: t("faq.realEstate"),
      answer: t("faq.answerRealEstate"),
    },
    {
      question: t("faq.otherCitiesExist"),
      answer: t("faq.otherCitiesAnswer"),
    },
    {
      question: t("faq.howToVerifyOpinions"),
      answer: t("faq.answerHowToVerify"),
    },
    {
      question: t("faq.canIParticipate"),
      answer: t("faq.answerCanIParticipate"),
    },
  ];

  return (
    <div className={className}>
      {withTitle && (
        <div className="flex justify-center">
          <p className="flex self-center absolute text-xs font-bold uppercase">
            {t("faq.frequentQuestion")}
          </p>
          <Image
            src={circulosection}
            alt=""
            width={152}
            className="h-auto"
          ></Image>
        </div>
      )}
      <div className="flex justify-center mt-6 mb-14 ">
        <h2 className="xs:text-2xl">{t("faq.solveDoubts")}</h2>
      </div>
      <div className="h-full relative">
        {datosFaq.map((obj: PropsFaq, index) => (
          <FaqUnit
            key={index}
            question={obj.question}
            answer={obj.answer}
          ></FaqUnit>
        ))}
      </div>
    </div>
  );
}
