import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { Circle, MapContainer, Marker, TileLayer } from 'react-leaflet'

type MapProps = {
  latitude: number
  longitude: number
}
function OpenStreetMap({ latitude, longitude }: MapProps) {
  const [center, setCenter] = useState({ lat: latitude, lng: longitude })
  const ZOOM_LEVEL = 15
  const windowWidth = window.innerWidth
  const purpleOptions = { color: '#9E80F7', radius: windowWidth < 768 ? 200 : 300 }

  const customIcon = L.icon({
    iconUrl: 'https://cdn.discordapp.com/attachments/685205264462643207/1117818625047400508/iconMarker.png',
    iconSize: windowWidth < 768 ? [35, 40] : [50, 55]
  })

  return (
    <MapContainer
      className="w-full h-full rounded-lg z-0"
      center={center}
      zoom={ZOOM_LEVEL}
      scrollWheelZoom={false}
      attributionControl={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Circle center={center} pathOptions={purpleOptions} radius={purpleOptions.radius} />
      <Marker position={center} icon={customIcon}>
        {/* <Popup>
          Soy ManudoDev. <br /> y lo sabes!.
        </Popup> */}
      </Marker>
    </MapContainer>
  )
}

export default OpenStreetMap
