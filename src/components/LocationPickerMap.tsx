import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  latitude: number | string;
  longitude: number | string;
  onSelect: (lat: number, lng: number) => void;
};

const LocationPickerMap = ({ latitude, longitude, onSelect }: Props) => {
  // Convert safely to number
  const lat = typeof latitude === "string" ? parseFloat(latitude) : latitude;
  const lng = typeof longitude === "string" ? parseFloat(longitude) : longitude;

  // Fallback if invalid
  const isValid = !isNaN(lat) && !isNaN(lng);
  const center = isValid ? [lat, lng] : [0, 0];

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        onSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "300px", width: "100%", marginTop: "1rem" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler />
      {isValid && <Marker position={center} icon={markerIcon} />}
    </MapContainer>
  );
};

export default LocationPickerMap;
