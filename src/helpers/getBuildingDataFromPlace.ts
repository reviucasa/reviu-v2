import { Building, Location, Coordinates } from "@/models/building";

export const getBuildingDataFromPlace = async (
  place: google.maps.places.Place
): Promise<Building> => {

  // Call fetchFields, passing the desired data fields.
  await place.fetchFields({
    fields: [
      "displayName",
      "formattedAddress",
      "location",
      "addressComponents",
    ],
  });

  let district = "";
  let municipality = place.addressComponents![2].longText ?? "";
  let province = place.addressComponents![3].longText ?? "";
  let postalCode = place.addressComponents![6].longText ?? "";

  if (
    ["Barcelona", "Madrid", "Valencia"].includes(
      place.addressComponents![3].longText!
    ) &&
    ["Barcelona", "Madrid", "Valencia"].includes(
      place.addressComponents![4].longText!
    )
  ) {
    district = place.addressComponents![2].longText ?? "";
    municipality = place.addressComponents![3].longText ?? "";
    province = place.addressComponents![4].longText ?? "";
    postalCode = place.addressComponents![7].longText ?? "";
  }

  const location: Location = {
    coordinates: {
      latitude: place.location?.lat(),
      longitude: place.location?.lng(),
    } as Coordinates,
    district,
    municipality,
    number: parseInt(place.addressComponents![0].longText ?? "0"),
    province,
    street: place.addressComponents![1].longText ?? "",
    type: "",
  };
  // const postalCode = place.address_components;

  const building: Building = {
    address: place.formattedAddress!,
    location,
    postalCode,
  };

  return building;
};
