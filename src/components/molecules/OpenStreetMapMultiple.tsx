"use client";
import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { OpinionCardSummary } from "./OpinionCardSummary";
import { Coordinates, Review } from "@/models/review";

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
  zoom = 15,
  iconSize = "md",
}: {
  reviews: Review[];
  zoom?: number;
  iconSize?: IconSize;
}) {
  const coordinates = reviews
    // .filter((r) => r.location?.coordinates != undefined && r.location?.coordinates != null)
    .map((r) => r.location!.coordinates!);

  const center =
    coordinates.length > 0 ? calculateCenter(coordinates) : undefined;

  const markers =
    coordinates.length > 0
      ? coordinates.map((c) => ({
          lat: c.latitude,
          lng: c.longitude,
        }))
      : undefined;

  const iconSizeFactor = iconSize == "sm" ? 0.8 : iconSize == "lg" ? 1.2 : 1.0;

  const icon = L.icon({
    iconUrl: "/images/marker-icon.png",
    iconSize: [28 * iconSizeFactor, 32 * iconSizeFactor],
    iconAnchor: [14 * iconSizeFactor, 32 * iconSizeFactor],
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

      {markers &&
        markers.map((m, i) => {
          try {
            m as LatLng;
          } catch (error) {
            console.log(
              reviews[i]?.catastroRef,
              reviews[i]?.address,
              "Wrong coordiantes"
            );
            return;
          }
          return (
            <Marker
              key={i}
              position={m}
              icon={icon}
              eventHandlers={{
                mouseover: (event) => event.target.openPopup(),
              }}
            >
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
