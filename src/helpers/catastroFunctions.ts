import { CatastroResponse, CoordinatesResponse } from "@/models/catastro";
import { removeVowelAccents2 } from "./removeAccents";
import { provincesData } from "@/staticData";
import { getProvinceAndMunicipality } from "./getProvinceAndMunicipality";
import { ref } from "firebase/storage";
import { addressExceptions } from "@/const/addressExceptions";

export const catastroAddressEndpoint = (
  provincia: string,
  municipio: string,
  sigla: string,
  calle: string,
  numero: string
): string =>
  `https://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/COVCCallejero.svc/json/Consulta_DNPLOC?Provincia=${provincia}&Municipio=${municipio}&Sigla=${sigla}&Calle=${calle}&Numero=${numero}`;

export const catastroReferenceEndpoint = (reference: string): string =>
  `https://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/COVCCallejero.svc/json/Consulta_DNPRC?RefCat=${reference}`;

export const getCoordinatesFromCatastroRef = async (ref: string) => {
  const url = `https://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/COVCCoordenadas.svc/json/Consulta_CPMRC?RefCat=${ref}`;

  // console.log("Coordinates URL:", url); // To verify the URL

  try {
    const response = await fetch(url);
    // console.log(response);
    if (!response.ok) {
      console.log(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return CoordinatesResponse.fromJson(data);
  } catch (error: any) {
    console.error("Error fetching catastro data:", error);
    return null;
  }
};

export interface CatastroAddressElements {
  type: string;
  street: string;
  number: string;
  province: string;
  municipality: string;
}

export const getCatastroDataFromReference = async (
  reference: string
): Promise<CatastroResponse | null> => {
  const url = catastroReferenceEndpoint(reference);

  // console.log("Reference URL:", url); // To verify the URL

  try {
    const response = await fetch(url);
    // console.log(response);
    if (!response.ok) {
      console.log(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return CatastroResponse.fromJson(data);
  } catch (error: any) {
    console.error("Error fetching catastro data from reference:", error);
    return null;
  }
};

export const getCatastroDataFromAddressElements = async (
  addressElements: CatastroAddressElements
): Promise<CatastroResponse | null> => {
  const url = catastroAddressEndpoint(
    encodeURIComponent(addressElements.province),
    encodeURIComponent(addressElements.municipality),
    addressElements.type,
    encodeURIComponent(addressElements.street),
    addressElements.number
  );

  console.log("Address URL:", url); // To verify the URL

  try {
    const response = await fetch(url);
    // console.log(response);
    if (!response.ok) {
      console.log(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return CatastroResponse.fromJson(data);
  } catch (error: any) {
    console.error("Error fetching catastro data:", error);
    return null;
  }
};

export const getCatastroDataFromAddress = async (
  address: string
): Promise<CatastroResponse | null> => {
  const addressElements = cleanAddress(address);
  console.log("Cleaned Address:", cleanAddress(address));

  if (addressElements) {
    const res = await getCatastroDataFromAddressElements(addressElements);
    if (res?.response.errores && res?.response.errores?.length > 0) {
      const addressElements = cleanAddress("calle " + address);
      console.log("Cleaned Address:", cleanAddress("calle " + address));

      if (addressElements) {
        return await getCatastroDataFromAddressElements(addressElements);
      }
    } else {
      return res;
    }
  }

  return null;
};

type Abbreviations = {
  [key: string]: string[];
};

const abbreviations: Abbreviations = {
  AC: ["ACCESO", "ACCES"],
  AG: ["AGREGADO", "AGREGAT"],
  AL: ["ALDEA", "ALAMEDA"],
  AN: ["ANDADOR", "CAMINADOR"],
  AR: ["AREA", "ARRABAL", "AREA", "RAVAL"],
  AU: ["AUTOPISTA"],
  AV: ["AVENIDA", "AVINGUDA"],
  AY: ["ARROYO", "RIEROL"],
  BJ: ["BAJADA", "BAIXADA"],
  BL: ["BLOQUE", "BLOC"],
  BO: ["BARRIO", "BARRI"],
  BQ: ["BARRANQUIL", "BARRANQUILL"],
  BR: ["BARRANCO", "BARRANC"],
  CA: ["CAÑADA", "CANYADA"],
  CG: ["COLEGIO", "CIGARRAL", "COL·LEGI", "CIGARRAL"],
  CH: ["CHALET", "XALE"],
  CI: ["CINTURON", "CINTURO"],
  CJ: ["CALLEJA", "CALLEJON", "CARRERO"],
  CL: ["CALLE", "CARRER", "VIA"],
  CM: ["CAMINO", "CARMEN", "CAMI", "CAMÍ", "CARMEN"],
  CN: ["COLONIA", "COLÒNIA"],
  CO: ["CONCEJO", "COLEGIO", "CONSISTORI", "COL·LEGI"],
  CP: ["CAMPA", "CAMPO", "CAMP"],
  CR: ["CARRETERA", "CARRERA"],
  CS: ["CASERIO", "MASIA"],
  CT: ["CUESTA", "COSTANILLA", "COSTA", "COSTANILLA"],
  CU: ["CONJUNTO", "CONJUNT"],
  CY: ["CALEYA", "CALLETA"],
  CZ: ["CALLIZO", "CALLETO"],
  DE: ["DETRÁS", "DARRERE"],
  DP: ["DIPUTACION", "DIPUTACIÓ"],
  DS: ["DISEMINADOS", "DISSIMINATS"],
  ED: ["EDIFICIOS", "EDIFICIS"],
  EM: ["EXTRAMUROS", "EXTRAMURS"],
  EN: ["ENTRADA", "ENSANCHE", "EIXAMPLE"],
  EP: ["ESPALDA", "ESQUENA"],
  ER: ["EXTRARRADIO", "EXTRARRADI"],
  ES: ["ESCALINATA"],
  EX: ["EXPLANADA"],
  FC: ["FERROCARRIL"],
  FN: ["FINCA"],
  GL: ["GLORIETA"],
  GR: ["GRUPO", "GRUP"],
  GV: ["GRAN VIA"],
  HT: ["HUERTA", "HUERTO", "HORTA", "HORT"],
  JR: ["JARDINES", "JARDINS"],
  LA: ["LAGO", "LLAC"],
  LD: ["LADO", "LADERA", "COSTAT", "COSTERA"],
  LG: ["LUGAR", "LLOC"],
  MA: ["MALECON", "MALECO"],
  MC: ["MERCADO", "MERCAT"],
  ML: ["MUELLE", "MOLL"],
  MN: ["MUNICIPIO", "MUNICIPI"],
  MS: ["MASIAS", "MASIES"],
  MT: ["MONTE", "MUNT"],
  MZ: ["MANZANA", "ILLA"],
  PB: ["POBLADO", "POBLAT"],
  PC: ["PLACETA", "PLACETA"],
  PD: ["PARTIDA"],
  PI: ["PARTICULAR", "PARTICULAR"],
  PJ: ["PASAJE", "PASADIZO", "PASSATGE", "PASSADIS"],
  PL: ["POLIGONO", "POLIGON"],
  PM: ["PARAMO", "PARAM"],
  PQ: ["PARROQUIA", "PARQUE", "PARROQUIA", "PARC"],
  PR: ["PROLONGACION", "CONTINUAC.", "PROLONGACIO", "CONTINUACIO"],
  PS: ["PASEO", "PASSEIG"],
  PT: ["PUENTE", "PONT"],
  PU: ["PASADIZO", "PASSADIS"],
  PZ: ["PLAZA", "PLAÇA"],
  QT: ["QUINTA"],
  RA: ["RACONADA"],
  RB: ["RAMBLA", "RAMBLA"],
  RC: ["RINCON", "RINCONA", "RACO", "RACONADA"],
  RD: ["RONDA"],
  RM: ["RAMAL"],
  RP: ["RAMPA"],
  RR: ["RIERA"],
  RU: ["RUA"],
  SA: ["SALIDA", "SORTIDA"],
  SC: ["SECTOR"],
  SD: ["SENDA"],
  SL: ["SOLAR"],
  SN: ["SALON", "SALO"],
  SU: ["SUBIDA", "PUJADA"],
  TN: ["TERRENOS", "TERRENYS"],
  TO: ["TORRENTE", "TORRENT"],
  TR: ["TRAVESIA", "TRAVESSIA"],
  UR: ["URBANIZACION", "URBANITZACIO"],
  VA: ["VALLE", "VALL"],
  VD: ["VIADUCTO", "VIADUCTE"],
  // VI: ["VIA"],
  VL: ["VIAL"],
  VR: ["VEREDA"],
};

export interface CleanAddressOptions {
  forUri?: boolean;
}

export function getMunicipalityMatch(
  addressElements: CatastroAddressElements
): boolean | string[] | undefined {
  const { province, municipality } = addressElements;

  // Check if the province exists in the records
  if (!provincesData[province]) {
    return undefined; // Province not found
  }

  // Check if the exact municipality exists in the province
  const municipalities = provincesData[province];
  if (municipalities.includes(municipality)) {
    return true; // Exact match found
  }

  let partialMatches: string[] = [];
  // Perform a partial match if exact match fails
  municipalities.some((recordedMunicipality) => {
    recordedMunicipality.toLowerCase().includes(municipality.toLowerCase());
    partialMatches.push(recordedMunicipality);
  });

  return partialMatches; // Returns true if partial match is found
}

export const cleanAddress = (
  address: string,
  options: CleanAddressOptions = {}
): CatastroAddressElements | null => {
  const { forUri = false } = options;

  // Check if the address starts with "via" or "vía" (case-insensitive)
  // If so, make "calle" the address type for normalization purposes
  if (/^via|vía/i.test(address.split(" ")[0])) {
    address = `calle ${address}`;
  } /* else if (/^cami|camí|camino/i.test(address.split(" ")[0])) {
    address = `calle ${address}`;
  } */

  // Flatten the abbreviations object to get all unique location types (both in Spanish and Catalan)
  const locationTypes = Object.entries(abbreviations).flatMap(
    ([abbr, words]) => [
      abbr.toLowerCase(),
      ...words.map((word) => word.toLowerCase()),
    ]
  );

  // Regex to match the address components
  const regex = new RegExp(
    `(${locationTypes.join(
      "|"
    )})\\s+(d'en(?=\\s)|d'(?=\\s)|del|de la|de les|de los|de|l'(?=\\s)|les)?\\s*([^,]+)\\s*,\\s*(\\d+)`,
    "i"
  );

  const match = address.match(regex);

  if (Object.keys(addressExceptions).includes(address.split(",")[0])) {
    console.log(
      "Exception address:",
      address.split(",")[0],
      removeVowelAccents2(addressExceptions[address.split(",")[0]])
    );
  }

  if (match) {
    const type = match[1];
    const street = Object.keys(addressExceptions).includes(
      address.split(",")[0]
    )
      ? removeVowelAccents2(addressExceptions[address.split(",")[0]])
      : removeVowelAccents2(
          match[3]
            .replace(/^d'/i, "")
            .replace(/^de\s+/i, "")
            .replace(/^del\s+/i, "")
            .replace(/^de la\s+/i, "")
            .replace(/^de les\s+/i, "")
            .replace(/^la\s+/i, "")
            .replace(/^les\s+/i, "")
            .replace(/l·l/g, "l.l")
        );

    const number = match[4];

    const [municipality, province] = getProvinceAndMunicipality(
      address.split(", ")[2]
    );

    // Normalize the type back to its abbreviation
    const normalizedType = Object.entries(abbreviations).find(
      ([abbr, words]) =>
        abbr.toLowerCase() === type.toLowerCase() ||
        words.map((word) => word.toLowerCase()).includes(type.toLowerCase())
    )?.[0];

    return forUri
      ? {
          type: type.replaceAll(" ", "-"),
          street: street.replaceAll(" ", "-"),
          number,
          municipality: municipality.replaceAll(" ", "-"),
          province: province.replaceAll(" ", "-"),
        }
      : {
          type: normalizedType ?? type,
          street,
          number,
          municipality,
          province,
        };
  }

  return null;
};
