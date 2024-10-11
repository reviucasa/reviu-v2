"use client";
import { MyReviewsContext } from "@/context/MyReviewsContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useContext } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { OpinionCardSummary } from "./OpinionCardSummary";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

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

function OpenStreetMapMultiple() {
  const { reviews, buildings } = useContext(MyReviewsContext);

  console.log(buildings);

  if (buildings.length == 0) {
    return;
  }

  const coordinates = buildings.map(
    (b) => ({ latitude: b?.latitude, longitude: b?.longitude } as Coordinates)
  );
  const center = calculateCenter(coordinates);

  const markers = coordinates.map((co) => ({
    lat: co.latitude,
    lng: co.longitude,
  }));

  const ZOOM_LEVEL = 15;

  const icon = L.icon({
    iconUrl: "/images/marker-icon.png",
    iconSize: [36, 40],
    iconAnchor: [18, 40],
  });

  return (
    <MapContainer
      className="w-full h-full rounded-lg z-0"
      center={center}
      zoom={ZOOM_LEVEL}
      scrollWheelZoom={true}
      attributionControl={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {markers.map((m, i) => (
        <Marker key={i} position={m} icon={icon}>
          <Popup>
            <OpinionCardSummary review={reviews[i]} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default OpenStreetMapMultiple;
