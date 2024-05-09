import Image from "next/image";
import IconAcoso from "public/images/IconAcoso.svg";
import IconAcosoRed from "public/images/IconAcosoRed.svg";
import IconFireRed from "public/images/IconFireRed.png";
import IconInfoFalse from "public/images/IconInfoFalse.svg";
import IconInfoFalseRed from "public/images/IconInfoFalseRed.png";
import IconSpam from "public/images/IconSpam.svg";
import IconSpamRed from "public/images/IconSpamRed.png";
import IconFire from "public/images/iconFire.svg";
import IconFlagGreen from "public/images/IconFlagGreen.svg";
import IconFlagRed from "public/images/IconFlagRed.svg";
import { Dialog } from "../atoms/Dialog";
import { useTranslations } from "next-intl";
import { ReviewReport, deleteReport } from "@/models/report";
import { Button } from "../atoms/Button";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export const DialogReviewReport = ({
  isOpen,
  setIsOpen,
  report,
  refetch,
}: {
  isOpen: boolean;
  setIsOpen?: any;
  report: ReviewReport;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<ReviewReport[] | undefined, Error>>;
}) => {
  const t = useTranslations();

  const Options = [
    {
      id: 0,
      title: "Other",
      IconRed: IconFlagRed,
      Icon: IconFlagGreen,
      text: "",
      code: "other",
    },
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

  const option = Options.find((o) => o.code == report.reason);

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={() => {
        setIsOpen(!isOpen);
      }}
      className="max-w-[600px] min-w-[400px] border border-gray-500"
    >
      <>
        <h5 className="lg:text-xl text-base">Review Report</h5>
        <div className="grid gap-2">
          {option && (
            <div className="p-4 mt-6 border border-gray-300 rounded-md">
              <div className="grid grid-cols-[1fr_auto] leading-6">
                <p className="text-gray-500 font-bold lg:text-base text-sm">
                  {option.title}
                </p>
                <Image
                  src={option.Icon}
                  width={24}
                  height={24}
                  alt={`Icono ${option.title}`}
                />

                <div className="lg:text-base text-sm">{option.text}</div>
              </div>
            </div>
          )}
          <div>
            <p className="mt-4 text-gray-500 text-sm">Comment</p>
            <p className="w-full h-[100px]">{report.comment}</p>
          </div>
          <div className="flex items-center justify-end mt-10">
            <Button
              buttonClassName="btn-primary-500 content-center overflow-hidden ring-0"
              onClick={async () => {
                await deleteReport(report.id);
                setIsOpen(false);
                refetch();
              }}
            >
              Mark as solved
            </Button>
          </div>
        </div>
      </>
    </Dialog>
  );
};
