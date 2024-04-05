//settingsContent.js
import React from "react";

const SettingsContent = ({
  groupedCityData,
  toggleCityVisibility,
  toggleAllVisibility,
}) => {
  const handleToggleVisibility = (cityName) => {
    toggleCityVisibility(cityName);
  };

  const handleToggleAllVisibility = () => {
    toggleAllVisibility();
  };

  //   // Determine if all cities are visible or not
  //   const allCitiesVisible = Object.values(groupedCityData).every(
  //     (city) => city.visible
  //   );

  return (
    <div>
      <br />
      <h4>Flood Zones Heat Map</h4>
      <h6>by City</h6>

      <br />
      {/* <label>
        <input
          type="checkbox"
          checked={!allCitiesVisible}
          onChange={handleToggleAllVisibility}
        />
        Toggle All
      </label> */}
      <ul>
        {Object.entries(groupedCityData).map(([cityName, { visible }]) => (
          <li key={cityName}>
            <label>
              <input
                type="checkbox"
                checked={!visible}
                onChange={() => handleToggleVisibility(cityName)}
              />
              {cityName}
            </label>
          </li>
        ))}
      </ul>
      <br />
    </div>
  );
};

export default SettingsContent;
