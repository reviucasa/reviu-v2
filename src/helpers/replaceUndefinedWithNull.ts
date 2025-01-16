import { Unidad } from "@/models/catastro";

export function replaceUndefinedWithNull(unit: Unidad): Unidad {
  return Object.fromEntries(
    Object.entries(unit).map(([key, value]) => [
      key,
      value === undefined ? null : value,
    ])
  ) as Unidad;
}
