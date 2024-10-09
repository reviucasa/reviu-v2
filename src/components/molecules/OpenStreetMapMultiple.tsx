import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

export type MapProps = {
  latitude: number;
  longitude: number;
};

const calculateCenter = (coords: MapProps[]): { lat: number; lng: number } => {
  const totalCoords = coords.length;

  const averageLatitude =
    coords.reduce((sum, coord) => sum + coord.latitude, 0) / totalCoords;
  const averageLongitude =
    coords.reduce((sum, coord) => sum + coord.longitude, 0) / totalCoords;

  return { lat: averageLatitude, lng: averageLongitude };
};

function OpenStreetMapMultiple({ coordinates }: { coordinates: MapProps[] }) {
  const center = calculateCenter(coordinates);

  const markers = coordinates.map((co) => ({
    lat: co.latitude,
    lng: co.longitude,
  }));

  const ZOOM_LEVEL = 13;

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
      scrollWheelZoom={false}
      attributionControl={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {markers.map((m, i) => (
        <Marker key={i} position={m} icon={icon}></Marker>
      ))}
    </MapContainer>
  );
}

export default OpenStreetMapMultiple;
