import Image from "next/image";
import { useContext } from "react";
import familiar from "public/AmbienteFamiliar.svg";
import ludico from "public/AmbienteLudico.svg";
import nocturno from "public/AmbienteNocturno.svg";
import quiet from "public/quiet.svg";
import student from "public/student-oriented'.svg";
import { useTranslations } from "next-intl";
import { Config, ConfigValue } from "@/models/types";
import { AnalysisContext } from "@/context/AnalysisSectionActive";

export const AreaResumeCardAmbience = ({ title }: { title?: string }) => {
  const { wordCloud } = useContext(AnalysisContext);
  const config = useTranslations("config");
  const IconAmbience = [
    { name: "quiet", image: quiet },
    { name: "student-oriented", image: student },
    { name: "familiar", image: familiar },
    { name: "festive", image: ludico },
    { name: "nightlife", image: nocturno },
  ];

  return (
    <div className="bg-zinc-50 border border-gray-300 rounded-lg min-h-[200px] W-44 py-6 px-8 h-full flex flex-col justify-between">
      <p className="flex justify-center mb-6 font-bold text-sm md:text-base">
        {title}
      </p>
      <div className="flex justify-center content-center ">
        <div className="flex flex-col">
          <div className="flex text-2xl font-extrabold gap-8 lg:gap-14 lg:flex-row flex-col">
            {wordCloud
              .find((name) => name.group === "vibe")
              ?.words.filter((vibes) => vibes.count > 0)
              .slice(0, 3)
              .map((vibes, index) => {
                const iconName = vibes.word;
                const matchIcon = IconAmbience.find(
                  (obj) => obj.name === iconName
                );
                return (
                  <div
                    key={index}
                    className="flex flex-col justify-center items-center	gap-6 "
                  >
                    {matchIcon && (
                      <Image
                        src={matchIcon.image}
                        alt={`Icono ${matchIcon.name}`}
                        width={50}
                        className="hover:scale-110 duration-500 w-50 h-auto"
                      />
                    )}
                    <p className="lg:text-xl text-base font-secondary">
                      {config(`neighbourhood.vibe.${vibes.word}`)}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};
