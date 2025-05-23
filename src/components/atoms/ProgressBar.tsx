import { usePathname } from "@/navigation";
import { useMemo } from "react";
import { removeLocaleFromPath } from "./DropDownLanguages";

type Step = {
  label: string;
  url: string;
};

export const ProgressBar = ({ steps }: { steps: Step[] }) => {
  const pathname = usePathname();

  const getPercent = useMemo((): number => {
    const activeIndex = steps.findIndex(
      (step) => step.url === removeLocaleFromPath(pathname)
    );
    return Math.round((activeIndex / (steps.length - 1)) * 100);
  }, [pathname, steps]);

  return (
    <div className="relative w-full h-1 bg-gray-200 rounded-full">
      <div
        className="absolute top-0 left-0 h-full bg-primary-500 rounded-full"
        style={{ width: `${getPercent}%` }}
      />
    </div>
  );
};
