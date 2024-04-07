import React, { useState, useEffect } from "react";
import styles from "@/styles/Sidebar.module.css";

const SettingsContent = ({
  cityVisibility,
  toggleCityVisibility,
  floodzoneData,
  toggleAllVisibility,
}) => {
  const [toggleAll, setToggleAll] = useState(true);
  const [openCities, setOpenCities] = useState({});

  useEffect(() => {
    const allGroupedChecked = Object.entries(groupedData).every(
      ([cityName, cities]) =>
        cities.every((city) => cityVisibility[city.properties.name] || false)
    );

    setToggleAll(allGroupedChecked);
  }, [cityVisibility]);

  const handleToggleAll = () => {
    toggleAllVisibility();
    setToggleAll(!toggleAll);
  };

  const handleCheckboxChange = (cityName) => {
    toggleCityVisibility(cityName);
    setToggleAll(false);
  };

  const handleGroupCheckboxChange = (cities) => {
    const anyUnchecked = cities.some(
      (city) => !cityVisibility[city.properties.name]
    );
    cities.forEach((city) => {
      if (anyUnchecked) {
        if (!cityVisibility[city.properties.name]) {
          toggleCityVisibility(city.properties.name);
        }
      } else {
        toggleCityVisibility(city.properties.name, false);
      }
    });
    setToggleAll(anyUnchecked);
  };

  const handleCityToggle = (cityName) => {
    setOpenCities((prevOpenCities) => ({
      ...prevOpenCities,
      [cityName]: !prevOpenCities[cityName],
    }));
  };

  const groupedData = floodzoneData.reduce((acc, city) => {
    const cityName = city.properties.name.split("_")[0];
    if (!acc[cityName]) {
      acc[cityName] = [];
    }
    acc[cityName].push(city);
    return acc;
  }, {});

  return (
    <div className={styles.settingsContent}>
      <h2>Flood Zone Heatmap</h2>
      <h5>by City</h5>
      <div>
        <input type="checkbox" checked={toggleAll} onChange={handleToggleAll} />
        <label>Toggle All</label>
      </div>
      {Object.entries(groupedData).map(([cityName, cities]) => (
        <div key={cityName}>
          <input
            type="checkbox"
            checked={cities.every(
              (city) => cityVisibility[city.properties.name]
            )}
            onChange={() => handleGroupCheckboxChange(cities)}
          />
          <label onClick={() => handleCityToggle(cityName)}>{cityName}</label>
          {openCities[cityName] && (
            <div>
              {cities.map((city) => (
                <div key={city.properties.name}>
                  <input
                    type="checkbox"
                    checked={cityVisibility[city.properties.name]}
                    onChange={() => handleCheckboxChange(city.properties.name)}
                  />
                  <label>{city.properties.name}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SettingsContent;
