import { provincesData } from "@/staticData";
import { removeAccents2 } from "./removeAccents";

export function getProvinceAndMunicipality(
  municipality: string
): [string, string] {
  for (const province in provincesData) {
    const municipalities = provincesData[province];

    // Check for exact match
    const exactMatch = municipalities.find(
      (recordedMunicipality) =>
        recordedMunicipality.toLowerCase() ===
        removeAccents2(municipality.toLowerCase())
    );

    if (exactMatch) {
      return [exactMatch, province];
    }

    // Check for partial match
    const partialMatch = municipalities.find((recordedMunicipality) =>
      recordedMunicipality.toLowerCase().includes(municipality.toLowerCase())
    );

    if (partialMatch) {
      return [partialMatch, province];
    }
  }

  return [municipality, ""];
}
