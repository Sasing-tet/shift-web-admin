import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map2 = () => {
  const [center, setCenter] = useState({ lat: 10.3157, lng: 123.8854 });
  const ZOOM_LEVEL = 10;
  const mapRef = useRef();

  return (
    <>
      <div className="map-container">
        <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {location.loaded && !location.error && (
            <Marker
              position={[location.coordinates.lat, location.coordinates.lng]}
            ></Marker>
          )}
        </MapContainer>
      </div>
    </>
  );
};

export default Map2;
