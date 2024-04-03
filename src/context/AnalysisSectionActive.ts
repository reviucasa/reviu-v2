import { WordCloud } from "@/models/analysis";
import { createContext } from "react";

type AnalysisContextType = {
  analysisSectionActive: string;
  setAnalysisSectionActive: React.Dispatch<React.SetStateAction<string>>;
  wordCloud: Array<WordCloud>;
  sections: {
    [key: string]: {
      title: string;
      sectionObject: JSX.Element;
    };
  };
};

export const AnalysisContext = createContext<AnalysisContextType>({
  analysisSectionActive: "",
  setAnalysisSectionActive: () => {},
  wordCloud: [],
  sections: {},
});
