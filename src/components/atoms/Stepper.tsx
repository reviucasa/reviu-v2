import { useDraft } from "@/hooks/swr/useDraft";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { removeLocaleFromPath } from "./DropDownLanguages";

type Step = {
  label: string;
  url: string;
};

type StepperProps = {
  steps: Step[];
  className?: string;
};

const Stepper: React.FC<StepperProps> = ({ steps, className }) => {
  const pathname = usePathname();
  const { draft } = useDraft();

  const getActiveStepIndex = (): number => {
    const activeIndex = steps.findIndex(
      (step) => step.url === removeLocaleFromPath(pathname)
    );
    return activeIndex >= 0 ? activeIndex : 0;
  };

  const isStepDisabled = useCallback(
    (index: number): boolean => index > (draft?.data?.step || 0),
    [draft?.data?.step]
  );

  const activeStepIndex = getActiveStepIndex();
  const t = useTranslations();
  const tLinks = useTranslations("linksTitles");

  return (
    <div className={`flex flex-col ${className}`}>
      {steps.map(({ label, url }, index) => (
        <div
          key={url}
          className={`flex items-center relative ${
            index !== steps.length - 1 ? "mb-4" : ""
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full box-content z-10 ${
              isStepDisabled(index) ? "bg-gray-300" : "bg-primary-500"
            } ${index === activeStepIndex && "shadow-trans"}`}
          />
          {index !== steps.length - 1 && (
            <div
              className={`h-[2px] rotate-90 w-12 absolute -left-5 -bottom-2 ${
                isStepDisabled(index + 1) ? "bg-gray-300" : "bg-primary-300"
              }`}
            ></div>
          )}
          <Link
            title={tLinks(url)}
            href={isStepDisabled(index) ? "" : url}
            className={`ml-4 font-medium text-sm p-2 hover:no-underline ${
              isStepDisabled(index) ? "text-gray-400 cursor-default" : ""
            } ${index === activeStepIndex && "bg-primary-100 rounded-md"}`}
          >
            {t(`common.${label}`)}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
