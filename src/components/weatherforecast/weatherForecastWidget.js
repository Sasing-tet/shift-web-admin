// WeatherForecastWidget.js

import React, { useState, useEffect } from "react";
import {
  fetchWeatherData,
  getAddressFromCoordinates,
  getWeatherIcon,
  getWeatherDescription,
} from "../utils/utils";
import HourlyWeatherForcastWidget from "../weatherforecast/hourlyWeatherForecast";
import styles from "@/styles/Home.module.css";

const WeatherForecastWidget = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [address, setAddress] = useState("Unknown Address");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHourlyForecast, setShowHourlyForecast] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const position = await getCurrentPosition();
        setCurrentPosition(position);
        const weatherData = await fetchWeatherData(
          position.latitude,
          position.longitude
        );
        setWeatherData(weatherData);
        const addr = await getAddressFromCoordinates(
          position.latitude,
          position.longitude
        );
        setAddress(addr);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch weather data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleHourlyForecast = () => {
    setShowHourlyForecast(!showHourlyForecast);
  };

  const getCurrentPosition = async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => reject(error)
      );
    });
  };

  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    } else if (error) {
      return <div>{error}</div>;
    } else {
      return (
        <div onClick={toggleHourlyForecast}>
          <div className={styles.currWeatherforecast}>
            <div className={styles.currWeatherIconDisp}>
              <div>
                {getWeatherIcon(
                  weatherData.hourlyWeatherDataList[0].weatherCode
                )}
              </div>
              <div>
                {weatherData.hourlyWeatherDataList[0].weatherDescription}
              </div>
            </div>
            <div>
              <span className={styles.currWeatherTemp}>
                {weatherData.currentTemperature}
              </span>
              <span className={styles.currWeatherTemp}>
                {weatherData.currentWeatherUnit}
              </span>
              <div className={styles.marqueeContainer}>
                <div className={styles.currWeatherLoc}>{address}</div>
              </div>
            </div>
          </div>
          <div
            className={`${styles.hourlyForecastContainer} ${
              showHourlyForecast ? styles.show : ""
            }`}
          >
            <br />
            <HourlyWeatherForcastWidget
              hourlyWeatherDataList={weatherData.hourlyWeatherDataList}
            />
          </div>
        </div>
      );
    }
  };
  return <div>{renderContent()}</div>;
};

export default WeatherForecastWidget;
