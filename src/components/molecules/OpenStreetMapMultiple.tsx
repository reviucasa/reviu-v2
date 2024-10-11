"use client";
import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { OpinionCardSummary } from "./OpinionCardSummary";
import { Building } from "@/models/building";
import { Review } from "@/models/review";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

type IconSize = "sm" | "md" | "lg";

const calculateCenter = (
  coords: Coordinates[]
): { lat: number; lng: number } => {
  const totalCoords = coords.length;

  const averageLatitude =
    coords.reduce((sum, coord) => sum + coord.latitude, 0) / totalCoords;
  const averageLongitude =
    coords.reduce((sum, coord) => sum + coord.longitude, 0) / totalCoords;

  return { lat: averageLatitude, lng: averageLongitude };
};

function OpenStreetMapMultiple({
  reviews,
  buildings,
  zoom = 15,
  iconSize = "md",
}: {
  reviews: Review[];
  buildings: (Building | undefined)[];
  zoom?: number;
  iconSize?: IconSize;
}) {
  // const { reviews, buildings } = useContext(MyReviewsContext);

  if (buildings.length == 0) {
    return;
  }

  const coordinates = buildings
    .filter((b, i) => {
      if (!b?.latitude || !b.longitude) {
        console.log(b?.latitude, b?.longitude);
        console.log(b?.id, b?.address, "Wrong coordiantes");
        console.log(reviews[i]?.id, reviews[i]?.address, "Wrong coordiantes");
      }
      return b?.latitude && b.longitude;
    })
    .map((b) => {
      return {
        latitude: b?.latitude,
        longitude: b?.longitude,
      } as Coordinates;
    });
  const center = calculateCenter(coordinates);

  const markers = coordinates.map((c) => ({
    lat: c.latitude,
    lng: c.longitude,
  }));

  const iconSizeFactor = iconSize == "sm" ? 0.8 : iconSize == "lg" ? 1.2 : 1.0;

  const icon = L.icon({
    iconUrl: "/images/marker-icon.png",
    iconSize: [36 * iconSizeFactor, 40 * iconSizeFactor],
    iconAnchor: [18 * iconSizeFactor, 40 * iconSizeFactor],
  });

  return (
    <MapContainer
      className="w-full h-full rounded-lg z-0"
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      attributionControl={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {markers.map((m, i) => {
        try {
          m as LatLng;
        } catch (error) {
          console.log(
            buildings[i]?.id,
            buildings[i]?.address,
            "Wrong coordiantes"
          );
          return;
        }
        return (
          <Marker key={i} position={m} icon={icon}>
            <Popup>
              <OpinionCardSummary review={reviews[i]} />
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default OpenStreetMapMultiple;
