import _ from "lodash";

export function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function removeAccents2(str: string) {
  return _.deburr(str);
}

export function removeVowelAccents(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, (char) => {
      // Decompose and recompose only non-basic Latin characters
      return char
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .normalize("NFC");
    });
}

export function removeVowelAccents2(str: string) {
  // Explicitly replace accented vowels
  return str
    .replace(/á|à|â|ä|ã/g, "a")
    .replace(/Á|À|Â|Ä|Ã/g, "A")
    .replace(/é|è|ê|ë/g, "e")
    .replace(/É|È|Ê|Ë/g, "E")
    .replace(/í|ì|î|ï/g, "i")
    .replace(/Í|Ì|Î|Ï/g, "I")
    .replace(/ó|ò|ô|ö|õ/g, "o")
    .replace(/Ó|Ò|Ô|Ö|Õ/g, "O")
    .replace(/ú|ù|û|ü/g, "u")
    .replace(/Ú|Ù|Û|Ü/g, "U");
}
