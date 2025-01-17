import { provincesData } from "@/staticData";

export function getProvinceFromMunicipality(municipality: string): string {
  for (const province in provincesData) {
    if (provincesData[province].includes(municipality.toUpperCase())) {
      return province.toLowerCase();
    }
  }
  return "Municipality not found in any province.";
}
