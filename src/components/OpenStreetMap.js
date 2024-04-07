import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map2 = ({ floodzoneData, cityVisibility, cityOrder }) => {
  const [center, setCenter] = useState({ lat: 10.3157, lng: 123.8854 });
  const ZOOM_LEVEL = 10;
  const mapRef = useRef();

  const styleFunction = (feature) => {
    const level = feature.properties.level;

    return {
      color: level === 1 ? "green" : level === 2 ? "yellow" : "red",
      weight: 2,
    };
  };

  const visibleFloodzoneData = floodzoneData.filter(
    (city) => cityVisibility[city.properties.name]
  );

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
        {cityOrder.map((cityName) => {
          const cityData = visibleFloodzoneData.find(
            (city) => city.properties.name === cityName
          );
          if (cityData) {
            return (
              <GeoJSON key={cityName} data={cityData} style={styleFunction} />
            );
          } else {
            return null;
          }
        })}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};
export default Map2;
