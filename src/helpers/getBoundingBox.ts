const EARTH_RADIUS_KM = 6371;

// Function to calculate a bounding box around a point
export const getBoundingBox = (lat: number, lng: number, radiusKm: number) => {
  const latChange = (radiusKm / EARTH_RADIUS_KM) * (180 / Math.PI);
  const lngChange = latChange / Math.cos(lat * (Math.PI / 180));

  return {
    minLat: lat - latChange,
    maxLat: lat + latChange,
    minLng: lng - lngChange,
    maxLng: lng + lngChange,
  };
};
