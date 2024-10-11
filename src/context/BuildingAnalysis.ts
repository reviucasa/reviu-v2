import { WordCloud } from "@/models/analysis";
import { createContext } from "react";

type BuildingAnalysisContextType = {
  buildingAnalysisSection: string;
  setBuildingAnalysisSection: React.Dispatch<React.SetStateAction<string>>;
  wordCloud: Array<WordCloud>;
  sections: {
    [key: string]: {
      title: string;
      sectionObject: JSX.Element;
    };
  };
};

export const BuildingAnalysisContext = createContext<BuildingAnalysisContextType>({
  buildingAnalysisSection: "",
  setBuildingAnalysisSection: () => {},
  wordCloud: [],
  sections: {},
});
