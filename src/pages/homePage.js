// homePage.js
import Head from "next/head";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Sidenav from "@/components/sidebar/SidebarNavigator";
import { fetchFloodzoneData } from "../components/utils/utils";
import {
  formatGeoJSON,
  getInitialVisibilityState,
} from "../components/utils/utils";
import styles from "@/styles/Home.module.css";

import WeatherForecastWidget from "../components/weatherforecast/weatherForecastWidget";

const OpenStreetMap = dynamic(() => import("../components/OpenStreetMap"), {
  ssr: false,
});

const home = () => {
  const [floodzoneData, setFloodzoneData] = useState([]);
  const [cityVisibility, setCityVisibility] = useState({});
  const [cityOrder, setCityOrder] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFloodzoneData();
        const formattedData = formatGeoJSON(data);
        setFloodzoneData(formattedData.features);

        const initialVisibility = getInitialVisibilityState(
          formattedData.features
        );
        setCityVisibility(initialVisibility);
        const cities = formattedData.features.map(
          (city) => city.properties.name
        );
        setCityOrder(cities);
      } catch (error) {
        console.error("Error fetching floodzone data:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className={styles.weatherforecastWidget}>
        {" "}
        <WeatherForecastWidget />
      </div>
      <div className="home-components">
        <Head>
          <title>SHIFT Admin</title>
          <link rel="icon" href="/shifticon.png" />
        </Head>
        <Sidenav
          cityVisibility={cityVisibility}
          setCityVisibility={setCityVisibility}
          floodzoneData={floodzoneData}
        />

        <OpenStreetMap
          floodzoneData={floodzoneData}
          cityVisibility={cityVisibility}
          cityOrder={cityOrder}
        />
      </div>
    </div>
  );
};

export default home;
