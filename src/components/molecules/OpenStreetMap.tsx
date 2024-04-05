import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type MapProps = {
  latitude: number;
  longitude: number;
};
function OpenStreetMap({ latitude, longitude }: MapProps) {
  const [center, setCenter] = useState({ lat: latitude/* +0.00025 */, lng: longitude });
  const ZOOM_LEVEL = 15;
  const windowWidth = window.innerWidth;
  const purpleOptions = {
    color: "#9E80F7",
    radius: windowWidth < 768 ? 250 : 350,
  };

  const icon = L.icon({
    iconUrl: "/marker-icon.png",
    iconSize: [45,51], iconAnchor: [22.5,51]
  });

  /* const customIcon = L.icon({
    iconUrl:
      "https://cdn.jsdelivr.net/npm/leaflet.awesome-markers@2.0.5/dist/leaflet.awesome-markers.min.js",
    iconSize: windowWidth < 768 ? [35, 40] : [50, 55],
  }); */

  return (
    <MapContainer
      className="w-full h-full rounded-lg z-0"
      center={center}
      zoom={ZOOM_LEVEL}
      scrollWheelZoom={false}
      attributionControl={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Circle
        center={center}
        pathOptions={purpleOptions}
        radius={purpleOptions.radius}
      />
      <Marker position={center} icon={icon}></Marker>
    </MapContainer>
  );
}

export default OpenStreetMap;
