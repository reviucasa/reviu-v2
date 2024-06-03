import { useDraft } from "@/hooks/swr/useDraft";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useRef } from "react";

type Step = {
  label: string;
  url: string;
};

type StepperProps = {
  steps: Step[];
};

const StepperHorizontal: React.FC<StepperProps> = ({ steps }) => {
  const pathname = usePathname();
  const { draft } = useDraft();

  const scrollAmount: number = 10; // The number of pixels to scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getActiveStepIndex = (): number => {
    const activeIndex = steps.findIndex((step) => step.url === pathname);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft +=
        scrollAmount * (activeIndex >= 0 ? activeIndex - 1 : 0);
    }
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
    <div
      ref={scrollContainerRef}
      className={`flex w-[92vw] overflow-x-scroll overflow-y-hidden`}
    >
      {steps.map(({ label, url }, index) => (
        <div
          key={url}
          className={`flex flex-col items-center relative min-w-20 py-2   ${
            index !== steps.length - 1 ? "mr-4" : ""
          }`}
        >
          {index !== steps.length - 1 && (
            <div
              className={`h-[2px] w-24 absolute top-[11px] left-[44px] ${
                isStepDisabled(index + 1) ? "bg-gray-300" : "bg-primary-300"
              }`}
            />
          )}
          <div
            className={`w-2 h-2 rounded-full box-content z-5  ${
              isStepDisabled(index) ? "bg-gray-300" : "bg-primary-500"
            } ${index === activeStepIndex && "shadow-trans"}`}
          />

          <Link
            title={tLinks(url)}
            href={isStepDisabled(index) ? "#" : url}
            className={`mt-4 text-sm p-1.5 hover:no-underline ${
              isStepDisabled(index) ? "text-gray-400 cursor-default" : ""
            } ${index === activeStepIndex && "bg-primary-100 rounded-md"}`}
          >
            {t(`common.${label}`).split(" ")[0]}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default StepperHorizontal;
