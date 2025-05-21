"use client";
import L from "leaflet";
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
import { Coordinates, Review } from "@/models/review";
import { useEffect, useState } from "react";

type IconSize = "sm" | "md" | "lg";

const calculateCenter = (
  coords: Coordinates[]
): { lat: number; lng: number } => {
  if (coords.length === 0) return { lat: 0, lng: 0 };

  // Calculate median to detect outliers
  const sortedLat = [...coords].map((c) => c.latitude).sort((a, b) => a - b);
  const sortedLng = [...coords].map((c) => c.longitude).sort((a, b) => a - b);

  const medianLat = sortedLat[Math.floor(sortedLat.length / 2)];
  const medianLng = sortedLng[Math.floor(sortedLng.length / 2)];

  // Define threshold (e.g., 0.5 standard deviations from median)
  const threshold = 0.5;

  const filteredCoords = coords.filter(
    (coord) =>
      Math.abs(coord.latitude - medianLat) < threshold &&
      Math.abs(coord.longitude - medianLng) < threshold
  );

  if (filteredCoords.length === 0) return { lat: medianLat, lng: medianLng };

  const totalCoords = filteredCoords.length;
  const averageLatitude =
    filteredCoords.reduce((sum, coord) => sum + coord.latitude, 0) /
    totalCoords;
  const averageLongitude =
    filteredCoords.reduce((sum, coord) => sum + coord.longitude, 0) /
    totalCoords;

  return { lat: averageLatitude, lng: averageLongitude };
};

function OpenStreetMapMultiple({
  coordinates,
  reviews: rawReviews,
  updateReviews,
  highlightedReviewId, // TODO
  setHighlightedReviewId,
  zoom: initialZoom = 15,
  iconSize = "md",
  showPin = true,
}: {
  coordinates?: Coordinates;
  reviews: Review[];
  updateReviews?: (lat: number, lng: number, zoom: number) => void;
  highlightedReviewId: string | null;
  setHighlightedReviewId: (id: string | null) => void;
  zoom?: number;
  iconSize?: IconSize;
  radiusKm?: number;
  showPin?: boolean;
}) {
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  /* let reviews = rawReviews.filter((r) => r.location); */

  const [reviews, setReviews] = useState<Review[]>(
    rawReviews.filter((r) => r.location)
  );

  useEffect(() => {
    if (coordinates) {
      setReviews(rawReviews);

      /* if (updateReviews) {
        updateReviews(coordinates.latitude, coordinates.longitude, zoom);
      } */
    }
  }, [coordinates, updateReviews, rawReviews, zoom]);

  /* const reviews = rawReviews
    .slice(15, 20)
    .filter(
      (r) =>
        r.location &&
        r.location.coordinates.latitude != undefined &&
        r.location.coordinates.longitude != undefined
    ); */

  /* const [reviews, setReviews] = useState<Review[]>(
    rawReviews.filter((r) => r.location)
  ); */

  /* useEffect(() => {
    if (coordinates) {
      // setReviews(rawReviews);

      if (updateReviews) {
        updateReviews(coordinates.latitude, coordinates.longitude, zoom);
      }
    }
  }, [coordinates, updateReviews, rawReviews, zoom]); */

  const center =
    reviews.length > 0
      ? calculateCenter(reviews.map((r) => r.location!.coordinates!))
      : { lat: coordinates?.latitude!, lng: coordinates?.longitude! };

  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(center);

  const iconSizeFactor = iconSize == "sm" ? 0.6 : iconSize == "lg" ? 1.2 : 1.0;

  const icon = L.icon({
    iconUrl: "/images/marker-icon.png",
    iconSize: [28 * iconSizeFactor, 32 * iconSizeFactor],
    iconAnchor: [14 * iconSizeFactor, 32 * iconSizeFactor],
  });

  return (
    <MapContainer
      className="w-full h-full rounded-lg z-0"
      center={mapCenter ?? center}
      zoom={zoom}
      scrollWheelZoom={true}
      attributionControl={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEventHandler
        setMapCenter={(c) => {
          setMapCenter({ lat: c.latitude, lng: c.longitude });
        }}
        updateReviews={updateReviews}
        setCurrentZoom={setZoom}
        setActiveMarker={setActiveMarker}
        coordinates={coordinates}
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
            mouseover: (_) => {
              setHighlightedReviewId(review.id);
            },
            click: (event) => {
              if (activeMarker === review.id) {
                setActiveMarker(null);
                event.target.closePopup();
              } else {
                setActiveMarker(review.id);
                event.target.openPopup();
              }
              setHighlightedReviewId(review.id);
            },
          }}
        >
          <Popup>
            <OpinionCardSummary review={reviews[i]} />
          </Popup>
        </Marker>
      ))}
      {showPin && (
        <Marker
          key={"pin"}
          position={{
            lat: coordinates!.latitude,
            lng: coordinates!.longitude,
          }}
          icon={L.icon({
            iconUrl: "/images/map_pin.png",
            iconSize: [36 * iconSizeFactor, 36 * iconSizeFactor],
            iconAnchor: [14 * iconSizeFactor, 36 * iconSizeFactor],
          })}
        />
      )}
    </MapContainer>
  );
}

function MapEventHandler({
  setMapCenter,
  updateReviews,
  setCurrentZoom,
  setActiveMarker,
  coordinates,
}: {
  setMapCenter: (coords: Coordinates) => void;
  updateReviews?: (lat: number, lng: number, zoom: number) => void;
  setCurrentZoom: (zoom: number) => void;
  setActiveMarker: (id: string | null) => void;
  coordinates?: Coordinates;
}) {
  const map = useMap();
  const [userDragged, setUserDragged] = useState(false);

  useEffect(() => {
    if (coordinates) {
      map.setView([coordinates.latitude, coordinates.longitude], map.getZoom());
    }
  }, [coordinates, map]);

  useEffect(() => {
    const handleDragStart = () => setUserDragged(true);
    map.on("dragstart", handleDragStart);
    return () => {
      map.off("dragstart", handleDragStart);
    };
  }, [map]);

  useMapEvent("moveend", (event) => {
    const newCenter = event.target.getCenter();
    setMapCenter({ latitude: newCenter.lat, longitude: newCenter.lng });
    if (updateReviews && userDragged)
      updateReviews(newCenter.lat, newCenter.lng, map.getZoom());
    setUserDragged(false); // reset for next move
  });

  useMapEvent("zoomend", () => {
    setCurrentZoom(map.getZoom());
  });

  useMapEvent("click", () => {
    setActiveMarker(null);
  });
  return null;
}

export default OpenStreetMapMultiple;
