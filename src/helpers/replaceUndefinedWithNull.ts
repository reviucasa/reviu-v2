import { Apartment } from "@/models/building";

export function replaceUndefinedWithNull(apartment: Apartment): Apartment {
  return Object.fromEntries(
    Object.entries(apartment).map(([key, value]) => [
      key,
      value === undefined ? null : value,
    ])
  ) as Apartment;
}
