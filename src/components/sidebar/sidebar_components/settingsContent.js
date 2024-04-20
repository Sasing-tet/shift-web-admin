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
      <p className={styles.settingsTitle}>Flood Zone Heatmap</p>
      <p className={styles.settingsSubtitle}>by City</p>
      <br />
      <div className={styles.SettsHeader}>
        <div className={styles.SettsToggleAll}>
          <input
            className={styles.inputCheckbox}
            type="checkbox"
            checked={toggleAll}
            onChange={handleToggleAll}
          />
          <label>Toggle All</label>
        </div>
        <div className={styles.legendRow}>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span>1: </span>
              <div
                className={styles.legendBox}
                style={{ backgroundColor: "green" }}
              ></div>
            </div>
            <div className={styles.legendItem}>
              <span>2: </span>
              <div
                className={styles.legendBox}
                style={{ backgroundColor: "yellow" }}
              ></div>
            </div>
            <div className={styles.legendItem}>
              <span>3: </span>
              <div
                className={styles.legendBox}
                style={{ backgroundColor: "red" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      {Object.entries(groupedData).map(([cityName, cities]) => (
        <div className={styles.groupHeatmap} key={cityName}>
          <div
            className={styles.groupedLabel}
            onClick={() => handleCityToggle(cityName)}
          >
            <input
              className={styles.inputCheckbox}
              type="checkbox"
              checked={cities.every(
                (city) => cityVisibility[city.properties.name]
              )}
              onChange={() => handleGroupCheckboxChange(cities)}
            />
            <label>{formatGroupName(cityName)}</label>{" "}
          </div>
          {openCities[cityName] && (
            <div className={styles.cityFloodzoneLevel}>
              {cities.map((city) => (
                <div
                  className={styles.cityFloodzoneLevelInput}
                  key={city.properties.name}
                >
                  <input
                    className={styles.inputCheckbox}
                    type="checkbox"
                    checked={cityVisibility[city.properties.name]}
                    onChange={() => handleCheckboxChange(city.properties.name)}
                  />
                  <label>{formatCityName(city)}</label>{" "}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const formatGroupName = (cityName) => {
  return cityName.replace(/([a-z])([A-Z])/g, "$1 $2");
};

const formatCityName = (city) => {
  console.log("City:", city);
  return `${city.properties.name.split("_")[0]} Flood Level: ${
    city.properties.level
  }`;
};

export default SettingsContent;
