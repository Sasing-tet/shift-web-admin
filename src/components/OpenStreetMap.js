import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchDriverData } from "../components/utils/utils";
import randomColor from "randomcolor";

const DEFAULT_AVATAR_URL =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?s=200&d=mp";

const Map2 = ({
  floodzoneData,
  cityVisibility,
  cityOrder,
  sourcedRouteData,
  mapRef,
}) => {
  const [center, setCenter] = useState({ lat: 10.3157, lng: 123.8854 });
  const ZOOM_LEVEL = 10;
  //const mapRef = useRef();
  const [routeColors, setRouteColors] = useState([]);

  useEffect(() => {
    const colors = sourcedRouteData.map(() => randomColor());
    setRouteColors(colors);
  }, [sourcedRouteData]);

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

  const onEachRouteFeature = async (feature, layer) => {
    const frequency = feature.properties.frequency;
    const driverId = feature.properties.driver_id;

    try {
      const driverData = await fetchDriverData(driverId);

      const avatarUrl = driverData.avatar_url
        ? driverData.avatar_url
        : DEFAULT_AVATAR_URL;
      const tooltipContent = `
      <div style="background-color: #071a52; border: 1px solid white; padding: 16px; border-radius: 5px; opacity: 1; color: white; font-family: 'Raleway'; display: flex; justify-content: center;">
      <div>
        <div style="font-weight: bold;">Frequency:  <span style="font-weight: bold; font-size: 25px; text-decoration: underline;">${frequency}</span></div><br/>
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="font-weight: bold;">Sourced from:</div>
          <img src="${avatarUrl}" alt="Avatar" style="width: 50px; height: 50px; border-radius: 50%; margin-top: 10px;">
          <div style="margin-top: 5px;">Driver <strong>${driverData.full_name}</strong></div>
        </div>
      </div>
    </div>
      `;

      layer.bindTooltip(tooltipContent, { direction: "top" });

      layer.on("click", () => {
        layer.bringToFront();
        const bounds = layer.getBounds();
        mapRef.current.fitBounds(bounds, { maxZoom: 18 });
      });
    } catch (error) {
      console.error("Error fetching driver data:", error.message);
    }
  };

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

        {sourcedRouteData.map((route, index) => {
          const color = routeColors[index] || randomColor();
          return (
            <GeoJSON
              key={index}
              data={route}
              style={{ color: color, weight: 12, opacity: 0.8 }}
              onEachFeature={onEachRouteFeature}
            />
          );
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
