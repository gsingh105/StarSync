import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] })
L.Marker.prototype.options.icon = DefaultIcon

const POSITION = [30.7046, 76.7179]

const MapSection = ({ small = false, style = {} }) => (
  <div style={style}>
    <MapContainer 
    key={new Date().getTime()}
      center={POSITION} 
      zoom={small ? 13 : 14} 
      scrollWheelZoom={false} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={POSITION}>
        <Popup>
          <strong>StarSync Sanctum</strong><br />Mohali, Punjab, India
        </Popup>
      </Marker>
    </MapContainer>
  </div>
)

export default MapSection
