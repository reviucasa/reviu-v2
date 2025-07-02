import { loader } from "@/components/atoms/AddressComboBox";

export const getMunicipalityCoordinates = async (
  municipality: string,
  province: string
): Promise<{ lat: number; lng: number } | null> => {
  await loader.importLibrary("geocoding"); // Load the Geocoding API

  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    const addressQuery = province
      ? `${municipality}, ${province}`
      : municipality;

    geocoder.geocode({ address: addressQuery }, (results, status) => {
      if (status === "OK" && results![0]) {
        const location = results![0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
      } else {
        console.error("Geocoding failed:", status);
        reject(null);
      }
    });
  });
};
