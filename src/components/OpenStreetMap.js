import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchFloodzoneData } from "./utils/utils";

import geojsonData from "./test";

const Map2 = () => {
  const [center, setCenter] = useState({ lat: 10.3157, lng: 123.8854 });
  const ZOOM_LEVEL = 10;
  const mapRef = useRef();
  const [floodzoneData, setFloodzoneData] = useState([]);
  const [cityVisibility, setCityVisibility] = useState({});

  useEffect(() => {
    console.log(geojsonData);

    const fetchData = async () => {
      try {
        const data = await fetchFloodzoneData();
        const formattedData = formatGeoJSON(data);
        console.log("Formatted data:", formattedData);
        setFloodzoneData(formattedData.features);
        setCityVisibility(getInitialVisibilityState(formattedData.features));
      } catch (error) {
        console.error("Error fetching floodzone data:", error.message);
      }
    };

    fetchData();
  }, []);

  const getInitialVisibilityState = (features) => {
    const initialVisibility = {};
    features.forEach((feature) => {
      initialVisibility[feature.properties.cityName] = true;
    });
    return initialVisibility;
  };

  const toggleCityVisibility = (cityName) => {
    setCityVisibility((prevVisibility) => ({
      ...prevVisibility,
      [cityName]: !prevVisibility[cityName],
    }));
  };

  const formatGeoJSON = (floodzoneData) => {
    const groupedData = floodzoneData.reduce((acc, curr) => {
      const cityName = curr.name.split("_")[0];
      if (!acc[cityName]) {
        acc[cityName] = [];
      }
      acc[cityName].push(curr);
      return acc;
    }, {});

    console.log("Grouped data:", groupedData);

    const features = [];
    for (const [cityName, cityData] of Object.entries(groupedData)) {
      cityData.forEach((dataItem) => {
        features.push({
          type: "Feature",
          properties: {
            floodzoneid: dataItem.floodzoneid,
            name: dataItem.name,
            level: dataItem.level,
            description: dataItem.description,
            cityName,
          },
          geometry: dataItem.coordinates_geojson,
        });
      });
    }
    return {
      type: "FeatureCollection",
      name: "FloodzoneData",
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      features,
    };
  };

  const styleFunction = (feature) => {
    const level = feature.properties.level;

    return {
      color: level === 1 ? "green" : level === 2 ? "yellow" : "red",
      weight: 2,
      opacity: cityVisibility[feature.properties.cityName] ? 1 : 0,
    };
  };

  return (
    <>
      <div className="map-container">
        <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
          {floodzoneData.map((geoJSONData, index) => (
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
