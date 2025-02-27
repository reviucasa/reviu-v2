"use client";
import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { OpinionCardSummary } from "./OpinionCardSummary";
import {
  Coordinates,
  getReviewsFromCoordinates,
  Review,
} from "@/models/review";
import { useCallback, useEffect, useState } from "react";

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
  coordinates,
  reviews: initialReviews,
  zoom: initialZoom = 15,
  iconSize = "md",
}: {
  coordinates?: Coordinates;
  reviews: Review[];
  zoom?: number;
  iconSize?: IconSize;
  radiusKm?: number;
}) {
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  // TODO: make sure all reviews have coordinates and catastro updated using notebook script
  let reviewsCoordinates = reviews
    .filter((r) => r.location)
    .map((r) => r.location!.coordinates!);

  const center =
    reviewsCoordinates.length > 0
      ? calculateCenter(reviewsCoordinates)
      : { lat: coordinates?.latitude!, lng: coordinates?.longitude! };

  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(center);

  const fetchReviews = useCallback(
    async (lat: number, lng: number, zoom: number) => {
      try {
        const adaptiveRadius = 40000 / Math.pow(2, zoom);
        const newReviews = await getReviewsFromCoordinates(
          lat,
          lng,
          adaptiveRadius
        );
        setReviews(newReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    },
    []
  );

  useEffect(() => {
    if (mapCenter) {
      fetchReviews(mapCenter.lat, mapCenter.lng, zoom);
    }
  }, [mapCenter, zoom, fetchReviews]);

  /*   const markers =
    reviewsCoordinates.length > 0
      ? reviewsCoordinates.map((c) => ({
          lat: c.latitude,
          lng: c.longitude,
        }))
      : undefined; */

  const iconSizeFactor = iconSize == "sm" ? 0.6 : iconSize == "lg" ? 1.2 : 1.0;

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
      <MapEventHandler
        setMapCenter={(c) => {
          setMapCenter({ lat: c.latitude, lng: c.longitude });
        }}
        setCurrentZoom={setZoom}
      />

      {reviews.map((review, i) => (
        <Marker
          key={i}
          position={{
            lat: review.location!.coordinates.latitude,
            lng: review.location!.coordinates.longitude,
          }}
          icon={icon}
          eventHandlers={{
            mouseover: (event) => event.target.openPopup(),
          }}
        >
          <Popup>
            <OpinionCardSummary review={reviews[i]} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function MapEventHandler({
  setMapCenter,
  setCurrentZoom,
}: {
  setMapCenter: (coords: Coordinates) => void;
  setCurrentZoom: (zoom: number) => void;
}) {
  const map = useMap();
  useMapEvent("moveend", (event) => {
    const newCenter = event.target.getCenter();
    setMapCenter({ latitude: newCenter.lat, longitude: newCenter.lng });
  });
  useMapEvent("zoomend", () => {
    setCurrentZoom(map.getZoom());
  });
  return null;
}

export default OpenStreetMapMultiple;
