import React, { useState, useEffect } from "react";
import styles from "@/styles/Sidebar.module.css";
import { fetchDriverData } from "../../utils/utils";
import { BiZoomIn } from "react-icons/bi";

const DEFAULT_AVATAR_URL =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?s=200&d=mp";

const StatisticsContent = ({ sourcedRouteData, onZoomInClick }) => {
  const [driverData, setDriverData] = useState({});
  const [expandedRoutes, setExpandedRoutes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const driverDataPromises = sourcedRouteData.map((route) =>
        fetchDriverData(route.properties.driver_id)
      );

      try {
        const driverDataArray = await Promise.all(driverDataPromises);
        const driverDataMap = {};

        driverDataArray.forEach((data, index) => {
          const driverId = sourcedRouteData[index].properties.driver_id;
          driverDataMap[driverId] = data;
        });

        setDriverData(driverDataMap);
      } catch (error) {
        console.error("Error fetching driver data:", error.message);
      }
    };

    fetchData();
  }, [sourcedRouteData]);

  const toggleRouteExpansion = (driverId) => {
    setExpandedRoutes((prevExpandedRoutes) =>
      prevExpandedRoutes.includes(driverId)
        ? prevExpandedRoutes.filter((id) => id !== driverId)
        : [...prevExpandedRoutes, driverId]
    );
  };

  return (
    <div className={styles.settingsContent}>
      <p className={styles.settingsTitle}>Alternate Routes</p>
      <p className={styles.settingsSubtitle}>Crowdsourced from Users</p>
      <br />
      {sourcedRouteData.map((route, index) => (
        <div
          className={styles.groupedAltRoute}
          key={route.properties.driver_id}
          onClick={() => toggleRouteExpansion(route.properties.driver_id)}
        >
          <div className={styles.groupedAltLabel}>
            <div className={styles.altRouteLabel}>
              <div className={styles.routeLabel}>
                <label> Alternate route {index + 1}</label>
              </div>
              <div className={styles.routeIcon}>
                <button
                  className={styles.zoomButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onZoomInClick(route);
                  }}
                >
                  <BiZoomIn />
                </button>
              </div>
            </div>
            {expandedRoutes.includes(route.properties.driver_id) && (
              <div className={styles.expandedContent}>
                <div className={styles.driverImg}>
                  {" "}
                  <img
                    src={
                      driverData[route.properties.driver_id]?.avatar_url ||
                      DEFAULT_AVATAR_URL
                    }
                    alt="Avatar"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginTop: "10px",
                    }}
                  />
                </div>
                <div>
                  <div>
                    <span style={{ fontWeight: "bold" }}>Frequency:</span>{" "}
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: 25,
                        textDecoration: "underline",
                      }}
                    >
                      {route.properties.frequency}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontWeight: "bold" }}>Sourced From:</span>{" "}
                    <div style={{ fontWeight: 500 }}>
                      Driver {driverData[route.properties.driver_id]?.full_name}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsContent;
