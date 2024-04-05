//homepage.js
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import SidebarNavigator from "@/components/sidebar/SidebarNavigator";
import { fetchFloodzoneData } from "../components/utils/utils";

const OpenStreetMap = dynamic(() => import("../components/OpenStreetMap"), {
  ssr: false,
});

const home = () => {
  const [floodzoneData, setFloodzoneData] = useState([]);
  const [groupedCityData, setGroupedCityData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFloodzoneData();
        const formattedData = formatGeoJSON(data);
        console.log("Formatted data:", formattedData);
        setFloodzoneData(formattedData.features);
        setGroupedCityData(formattedData.groupedData);
      } catch (error) {
        console.error("Error fetching floodzone data:", error.message);
      }
    };

    fetchData();
  }, []);

  const formatGeoJSON = (floodzoneData) => {
    const groupedData = floodzoneData.reduce((acc, curr) => {
      const cityName = curr.name.split("_")[0];
      if (!acc[cityName]) {
        acc[cityName] = { visible: true, data: [] };
      }
      acc[cityName].data.push(curr);
      return acc;
    }, {});

    console.log("Grouped data:", groupedData);

    const features = [];
    for (const [cityName, { visible, data }] of Object.entries(groupedData)) {
      if (visible) {
        data.forEach((dataItem) => {
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
    }

    return {
      type: "FeatureCollection",
      name: "FloodzoneData",
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      features,
      groupedData,
    };
  };

  return (
    <div className="home-components">
      <SidebarNavigator
        groupedCityData={groupedCityData}
        setGroupedCityData={setGroupedCityData}
      />
      <OpenStreetMap
        floodzoneData={floodzoneData}
        groupedCityData={groupedCityData}
      />
      <div></div>
    </div>
  );
};

export default home;
