//OpenStreetMap.js
import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map2 = ({ floodzoneData, groupedCityData }) => {
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

  const visibleFloodzoneData = floodzoneData.filter((data) => {
    const cityName = data.properties.cityName;
    const cityVisible = groupedCityData[cityName]?.visible;
    return !cityVisible;
  });

  return (
    <>
      <div className="map-container">
        <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
          {visibleFloodzoneData.map((geoJSONData, index) => (
            <GeoJSON key={index} data={geoJSONData} style={styleFunction} />
          ))}
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
