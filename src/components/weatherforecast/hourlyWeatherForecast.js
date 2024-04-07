import React from "react";
import { DateTime } from "luxon";
import { getWeatherIcon } from "../utils/utils";
import styles from "@/styles/Home.module.css";

const HourlyWeatherForecast = ({ hourlyWeatherDataList }) => {
  const currentHour = DateTime.now().hour;

  const filteredList = hourlyWeatherDataList.filter((item) => {
    const itemHour = DateTime.fromISO(item.time).hour;
    return itemHour >= currentHour;
  });

  const timeFormat = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div className={styles.hourlyWeatherContainer}>
      <div className={styles.hourlyItems}>
        <table>
          <tbody>
            <tr>
              {filteredList.map((item, index) => (
                <React.Fragment key={index}>
                  <td>
                    <div className={styles.hourlyItem}>
                      <div className={styles.hourlyItemTime}>
                        {timeFormat.format(DateTime.fromISO(item.time))}
                      </div>
                      <div className={styles.hourlyItemIcon}>
                        {getWeatherIcon(item.weatherCode)}
                      </div>
                      <div
                        className={styles.hourlyItemTemp}
                      >{`${item.temperature}°C`}</div>
                    </div>
                  </td>
                </React.Fragment>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HourlyWeatherForecast;
