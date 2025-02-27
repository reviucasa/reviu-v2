export const getLocationFromIP = async () => {
  try {
    const res = await fetch(`https://ipinfo.io/json?token=cbd26555dcda3d`);
    const data = await res.json();
    const [lat, lon] = data.loc.split(",");
    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      city: data.city,
      region: data.region,
      country: data.country,
    };
  } catch (error) {
    console.error("Error fetching IP location:", error);
    return null;
  }
};
