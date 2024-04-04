import _ from "lodash";

export function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function removeAccents2(str: string) {
  return _.deburr(str);
}
