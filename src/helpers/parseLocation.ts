import * as wkx from "wkx";

export function parseLocation(location: string): {
  latitude: number;
  longitude: number;
} {
  const buffer = Buffer.from(location, "hex");
  const geometry: any = wkx.Geometry.parse(buffer).toGeoJSON();

  if (geometry.type === "Point") {
    return {
      latitude: geometry.coordinates[1],
      longitude: geometry.coordinates[0],
    };
  }

  // Handle error or unexpected geometry type
  throw new Error("Invalid geometry type");
}
