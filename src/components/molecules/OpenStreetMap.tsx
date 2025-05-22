"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { Circle, MapContainer, Marker, TileLayer } from "react-leaflet";

type MapProps = {
  latitude: number;
  longitude: number;
  zoom?: number;
  circleDecoration?: boolean;
};
function OpenStreetMap({
  latitude,
  longitude,
  zoom = 15,
  circleDecoration,
}: MapProps) {
  const center = {
    lat: latitude /* +0.00025 */,
    lng: longitude,
  };

  const windowWidth = window.innerWidth;

  const purpleOptions = {
    color: "#9E80F7",
    radius: windowWidth < 768 ? 250 : 350,
  };

  const icon = L.icon({
    iconUrl: "/images/marker-icon.png",
    iconSize: [45, 51],
    iconAnchor: [22.5, 51],
  });

  return (
    <MapContainer
      className="w-full h-full rounded-lg z-0"
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      attributionControl={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {circleDecoration && (
        <Circle
          center={center}
          pathOptions={purpleOptions}
          radius={purpleOptions.radius}
        />
      )}
      <Marker position={center} icon={icon}></Marker>
    </MapContainer>
  );
}

export default OpenStreetMap;
