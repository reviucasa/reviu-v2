import { AnalysisContext } from "@/context/AnalysisSectionActive";
import { useTranslations } from "next-intl";
import { useContext } from "react";

export const AreaResumeCardService = ({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) => {
  const { wordCloud } = useContext(AnalysisContext);
  const config = useTranslations("config");

  return (
    <div
      className={`flex flex-col justify-center bg-zinc-50 border border-gray-300 rounded-lg min-h-[200px] W-44 lg:py-6 lg:px-8 py-6 px-4  ${className}`}
    >
      <p className="flex justify-center mb-6 font-bold">{title}</p>
      <div className="flex flex-wrap justify-center ">
        {wordCloud
          .find((name) => name.group === "services")
          ?.words.filter((services) => services.count > 0)
          .map((services, index) => (
            <div
              className="h-10 w-fit py-2 px-4 bg-white rounded-[8px] border-[1px] border-purple-400 m-2 hover:bg-purple-100"
              key={index}
            >
              {config(`neighbourhood.services.${services.word}`) /* +
                " (" +
                services.count +
                ")" */}
            </div>
          ))}
      </div>
    </div>
  );
};
