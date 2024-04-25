import Image from "next/image";
import { useState } from "react";
import IconAcoso from "public/IconAcoso.svg";
import IconAcosoRed from "public/IconAcosoRed.svg";
import IconFireRed from "public/IconFireRed.png";
import IconInfoFalse from "public/IconInfoFalse.svg";
import IconInfoFalseRed from "public/IconInfoFalseRed.png";
import IconSpam from "public/IconSpam.svg";
import IconSpamRed from "public/IconSpamRed.png";
import backArrow from "public/backArrow.png";
import IconFire from "public/iconFire.svg";
import { Button } from "../atoms/Button";
import { Dialog } from "../atoms/Dialog";
import { useTranslations } from "next-intl";
import { ReviewReport, createReviewReport } from "@/models/report";
import { auth } from "@/firebase/config";
import { useUser } from "@/hooks/swr/useUser";

export const DialogReport = ({
  isOpen,
  setIsOpen,
  reviewId,
}: {
  isOpen: boolean;
  setIsOpen?: any;
  reviewId: string;
}) => {
  // const [openModalInfo, setOpenModalInfo] = useState<boolean>(false)
  const [openModalReport, setOpenModalReport] = useState<boolean>(false);
  const [textReport, setTextReport] = useState("");
  const [selectedOption, setSelectedOption] = useState<number>();
  const { user } = useUser();
  const t = useTranslations();

  const handleSelectedReportType = (id: number) => {
    setSelectedOption(id);
  };
  const handleModalReport = () => {
    setOpenModalReport(!openModalReport);
    setSelectedOption(undefined);
  };
  const handleModalTextReport = () => {
    if (!textReport) {
      alert(t("common.debesEscribirAlgo"));
    } else {
      setIsOpen(!isOpen);
    }
  };
  const handleTextReport = (e: any) => {
    setTextReport(e.target.value);
  };

  const Options = [
    {
      id: 1,
      title: t("common.acoso"),
      IconRed: IconAcosoRed,
      Icon: IconAcoso,
      text: t("common.informacionAtaca"),
      code: "acoso",
    },
    {
      id: 2,
      title: t("common.discriminacion"),
      IconRed: IconFireRed,
      Icon: IconFire,
      text: t("common.lenguajeOfensivo"),
      code: "discriminacion",
    },
    {
      id: 3,
      title: t("common.spam"),
      IconRed: IconSpamRed,
      Icon: IconSpam,
      text: "",
      code: "spam",
    },
    {
      id: 4,
      title: t("common.informacionFalsa"),
      IconRed: IconInfoFalseRed,
      Icon: IconInfoFalse,
      text: "",
      code: "informacionFalsa",
    },
  ];

  const handleReviewReport = async () => {
    if (user) {
      const report: Partial<ReviewReport> = {
        reason: Options.find((o) => o.id == selectedOption)?.code || "other",
        reviewId,
        comment: textReport,
        user: {
          id: user!.id,
          email: auth.currentUser!.email!,
          name: [user.name, user.lastname].join(" "),
          type: user.type,
        },
      };
      createReviewReport(report);
    }
  };
  
  // TODO: (crear trigger perque senvii un email del report)
  // limitar el numero de reports al mes que pot tenir un usuari?

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={() => {
        setIsOpen(!isOpen);
      }}
      className="w-[600px] border border-gray-500"
    >
      {!openModalReport ? (
        <>
          <h5 className="lg:text-2xl text-base">
            {t("common.reportarComentario")}
          </h5>
          <p className="mb-6 lg:text-base text-sm">{t("common.eligeUno")}</p>
          <div className="grid gap-2">
            {Options.map(({ id, title, IconRed, Icon, text }) => (
              <div
                key={title}
                className={`${
                  selectedOption === id ? "bg-primary-100" : "bg-white"
                }`}
                onClick={() => handleSelectedReportType(id)}
              >
                <div className="p-4 border border-gray-300 rounded-md cursor-pointer">
                  <div className="grid grid-cols-[1fr_auto] leading-6">
                    <p className="text-gray-500 font-bold lg:text-base text-sm">
                      {title}
                    </p>
                    {selectedOption === id ? (
                      <Image
                        src={IconRed}
                        width={24}
                        height={24}
                        alt={`Icono ${title}`}
                      />
                    ) : (
                      <Image
                        src={Icon}
                        width={24}
                        height={24}
                        alt={`Icono ${title}`}
                      />
                    )}
                    <div className="lg:text-base text-sm">{text}</div>
                  </div>
                </div>
              </div>
            ))}
            <div>
              <div className="mt-6 flex justify-between">
                <p>{t("common.describeMotivo")}</p>
                <span className="text-gray-500 text-sm">
                  {t("common.opcional")}
                </span>
              </div>
              <textarea
                className="w-full h-[100px]"
                placeholder={t("common.escribeAqui")}
                onChange={handleTextReport}
              ></textarea>
            </div>
            <div className="flex items-center justify-between mt-8 gap-4">
              <p
                className="underline lg:text-base text-sm cursor-pointer"
                onClick={handleModalReport}
              >
                {t("common.reportarReview")}
              </p>

              <Button
                buttonClassName="btn-primary-500 content-center overflow-hidden"
                disabled={!selectedOption}
                onClick={() => {
                  handleReviewReport();
                  setIsOpen(!isOpen);
                }}
              >
                {t("common.reportar")}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="lg:h-[500px] h-[400px] grid">
          <div>
            <div className="flex pb-8 relative lg:bottom-9 lg:right-5 bottom-5 right-2">
              <Image
                quality={100}
                src={backArrow}
                width={24}
                height={24}
                alt="Icono atrás"
                className="cursor-pointer"
                onClick={() => {
                  setOpenModalReport(!openModalReport);
                }}
              />
              <p className="font-bold relative">
                {t("common.reportarComentario")}
              </p>
            </div>
          </div>
          <div>
            <p className="mb-2">{t("common.describeMotivo")}</p>
            <textarea
              className="w-full h-[200px]"
              placeholder={t("common.escribeAqui")}
              onChange={handleTextReport}
            ></textarea>
          </div>
          <div className="flex items-center justify-end mt-10">
            <Button
              buttonClassName="btn-primary-500 content-center overflow-hidden"
              disabled={!textReport}
              onClick={() => {
                setSelectedOption(0)
                handleModalTextReport();
                handleReviewReport();
              }}
            >
              {t("common.reportar")}
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
};
