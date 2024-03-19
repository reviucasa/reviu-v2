import { WordCloud } from "@/models/types";
import { createContext } from "react";

type AnalisisContextType = {
  analisisSectionActive: string;
  setAnalisisSectionActive: React.Dispatch<React.SetStateAction<string>>;
  wordCloud: Array<WordCloud>;
  sections: {
    [key: string]: {
      title: string;
      sectionObject: JSX.Element;
    };
  };
};

export const AnalisisContext = createContext<AnalisisContextType>({
  analisisSectionActive: "",
  setAnalisisSectionActive: () => {},
  wordCloud: [],
  sections: {},
});
