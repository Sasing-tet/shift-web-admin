import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Sidenav from "@/components/sidebar/SidebarNavigator";
import { fetchFloodzoneData } from "../components/utils/utils";

// import OpenStreetMap from '../component/OpenStreetMap'
const OpenStreetMap = dynamic(() => import("../components/OpenStreetMap"), {
  ssr: false,
});

const home = () => {
  const [floodzoneData, setFloodzoneData] = useState([]);
  const [cityVisibility, setCityVisibility] = useState({});

  useEffect(() => {
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

  return (
    <div className="home-components">
      <Sidenav cityVisibility={cityVisibility} floodzoneData={floodzoneData} />
      <OpenStreetMap />
      <div></div>
    </div>
  );
};

export default home;
