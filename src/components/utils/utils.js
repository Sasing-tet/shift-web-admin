//utils.js
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

import { FaSun, FaCloudSun, FaCloud, FaSmog, FaTint } from "react-icons/fa";
import { MdHelp } from "react-icons/md";

const supabaseUrl = "https://qegghlcugbbvyuopfegq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZ2dobGN1Z2Jidnl1b3BmZWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ5NTU3NjMsImV4cCI6MjAxMDUzMTc2M30.HJf-DFvWbqRWqTIUjdJkeuQalXEAvqPfi-GN7lYQ-PY";
const supabase = createClient(supabaseUrl, supabaseKey);

export const getUserInputLevel = async (
  setSnackbarSeverity,
  setSnackbarMessage,
  setSnackbarOpen
) => {
  try {
    const userInput = window.prompt("Please enter the risk level (1-3):", "1");
    // const userInput = await customInputDialog();
    if (userInput === null) {
      return null;
    }
    const level = parseInt(userInput);
    if (isNaN(level) || level < 1 || level > 3) {
      setSnackbarSeverity("error");
      setSnackbarMessage(
        "Invalid input. Please enter a number between 1 and 3."
      );
      setSnackbarOpen(true);
      return null;
    }
    return level;
  } catch (error) {
    console.error("Error getting user input for level:", error);
    throw error;
  }
};

export const extractDataFromGeoJSON = (geoJSONData) => {
  try {
    const geoJSON = JSON.parse(geoJSONData);
    const name = geoJSON.name;
    const crs = geoJSON.crs.properties.name;
    const description = geoJSON.features[0].properties.name;
    const coordinates = geoJSON.features[0].geometry.coordinates;
    const coordinates_text = JSON.stringify({
      type: geoJSON.features[0].geometry.type,
      coordinates: coordinates,
    });

    return { name, crs, description, coordinates_text };
  } catch (error) {
    console.error("Error extracting data from GeoJSON:", error);
    throw error;
  }
};
export const callSavingFloodzoneGeomRPC = async ({
  name,
  level,
  crs,
  description,
  coordinates_text,
}) => {
  try {
    console.log("Calling RPC: saving_floodzone_geom with data:", {
      name,
      level,
      crs,
      description,
      coordinates_text,
    });

    const { data, error } = await supabase.rpc("saving_floodzone_geom", {
      name,
      level,
      crs,
      description,
      coordinates_text,
    });

    if (error) {
      console.error("RPC Error:", error);
      return { error: error.message };
    }

    console.log("RPC: saving_floodzone_geom called successfully:", data);
    return { data };
  } catch (error) {
    console.error("Error calling RPC: saving_floodzone_geom", error);
    return { error: error.message };
  }
};

export const fetchFloodzoneData = async () => {
  try {
    const { data, error } = await supabase
      .from("floodzone_geojson_view")
      .select("*");
    console.log("Floodzone data:", data);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching floodzone data:", error.message);
    throw error;
  }
};

export const formatGeoJSON = (floodzoneData) => {
  const features = [];

  for (const dataItem of floodzoneData) {
    const cityName = dataItem.name.split("_")[0];

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

export const getInitialVisibilityState = (floodzoneData) => {
  const initialVisibility = {};
  for (const city of floodzoneData) {
    initialVisibility[city.properties.name] = true;
  }
  return initialVisibility;
};

export const fetchWeatherData = async (latitude, longitude) => {
  try {
    const position = await getCurrentPosition();
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&current_weather=true&forecast_days=1`
    );

    if (response.status === 200) {
      const data = response.data;

      const currentTemperature = data.current_weather.temperature;
      const currentWeatherCode = data.current_weather.weathercode;
      const currentWeatherUnit = data.hourly_units.temperature_2m;

      const hourlyForecastTime = data.hourly.time;
      const hourlyForecastTemp = data.hourly.temperature_2m;
      const hourlyForecastWeatherCode = data.hourly.weathercode;

      const hourlyWeatherDataList = hourlyForecastTime.map((time, index) => {
        return {
          time,
          temperature: hourlyForecastTemp[index],
          weatherCode: hourlyForecastWeatherCode[index],
          weatherDescription: getWeatherDescription(
            hourlyForecastWeatherCode[index]
          ),
        };
      });

      return {
        currentTemperature,
        currentWeatherUnit,
        currentWeatherCode,
        hourlyWeatherDataList,
      };
    } else {
      throw new Error(`Failed to fetch weather data: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
};

async function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error)
    );
  });
}

export const getAddressFromCoordinates = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      const address = response.data.display_name;
      return address;
    } else {
      throw new Error(`Failed to get address: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to get address:", error);
    throw error;
  }
};

export const getWeatherDescription = (weatherCode) => {
  switch (weatherCode) {
    case 0:
      return "Clear Sky";
    case 1:
      return "Mainly Clear";
    case 2:
      return "Partly Cloudy";
    case 3:
      return "Overcast";
    case 45:
      return "Fog";
    case 48:
      return "Depositing Rime Fog";
    case 51:
      return "Drizzle: Light Intensity";
    case 53:
      return "Drizzle: Moderate Intensity";
    case 55:
      return "Drizzle: Dense Intensity";
    case 56:
      return "Freezing Drizzle: Light";
    case 57:
      return "Freezing Drizzle: Dense Intensity";
    case 61:
      return "Rain: Slight Intensity";
    case 63:
      return "Rain: Moderate Intensity";
    case 65:
      return "Rain: Heavy Intensity";
    case 66:
      return "Freezing Rain: Light Intensity";
    case 67:
      return "Freezing Rain: Heavy Intensity";
    case 80:
      return "Rain Showers: Slight";
    case 81:
      return "Rain Showers: Moderate";
    case 82:
      return "Rain showers: Violent";
    case 95:
      return "Thunderstorm";
    case 96:
      return "Thunderstorm: slight hail";
    case 99:
      return "Thunderstorm: heavy hail";
    default:
      return "Unknown";
  }
};

export const getWeatherIcon = (weatherCode) => {
  switch (weatherCode) {
    case 0:
      return <FaSun size={35} color="#007bff" />;
    case 1:
      return <FaCloudSun size={35} color="#007bff" />;
    case 2:
      return <FaCloud size={35} color="#007bff" />;
    case 3:
      return <FaCloud size={35} color="#007bff" />;
    case 45:
      return <FaSmog size={35} color="#007bff" />;
    case 48:
      return <FaCloud size={35} color="#007bff" />;
    case 51:
      return <FaTint size={35} color="#007bff" />;
    default:
      return <MdHelp size={35} color="#007bff" />;
  }
};

export const signIn = async (email, password) => {
  try {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("Authentication Response:", response);

    if (response.error) {
      throw new Error(`${response.error.message}`);
    }

    if (response.data && response.data.session) {
      const { user } = response.data;
      const { data, error } = await supabase
        .from("admin")
        .select("*")
        .eq("username", user.email);

      console.log("Admin Data:", data);

      if (error) {
        throw new Error(`Error fetching admin data`);
      }

      if (data && data.length > 0) {
        return true;
      } else {
        throw new Error("User is not an admin.");
      }
    } else {
      throw new Error("User session not found.");
    }
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

export const fetchSourcedRouteData = async () => {
  try {
    const { data, error } = await supabase.from("alt_route_view").select("*");
    console.log("Sourced route data:", data);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching Sourced route data:", error.message);
    throw error;
  }
};

export const formatSourcedRouteData = (sourcedRouteData) => {
  const uniqueRoutes = [];

  sourcedRouteData.forEach((route) => {
    let similarRoutesCount = 0;

    for (const existingRoute of uniqueRoutes) {
      const existingCoordinates = existingRoute.geometry.coordinates;
      const newCoordinates = route.coordinates.coordinates;
      let similarCoordinatesCount = 0;

      for (let i = 0; i < newCoordinates.length; i++) {
        const newCoord = newCoordinates[i];

        for (let j = 0; j < existingCoordinates.length; j++) {
          const existingCoord = existingCoordinates[j];

          if (
            Math.abs(existingCoord[0] - newCoord[0]) < 0.0001 &&
            Math.abs(existingCoord[1] - newCoord[1]) < 0.0001
          ) {
            similarCoordinatesCount++;
            break;
          }
        }
      }

      if (
        similarCoordinatesCount / newCoordinates.length >= 0.9 &&
        similarCoordinatesCount / existingCoordinates.length >= 0.9
      ) {
        similarRoutesCount++;
        break;
      }
    }

    if (similarRoutesCount === 0) {
      uniqueRoutes.push({
        type: "Feature",
        properties: {
          driver_id: route.driver_id,
          alt_route_id: route.alt_route_id,
          ride_id: route.ride_id,
          frequency: route.frequency,
        },
        geometry: {
          type: "LineString",
          coordinates: route.coordinates.coordinates,
        },
      });
    }
  });

  return {
    type: "FeatureCollection",
    name: "SourcedRouteData",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: uniqueRoutes,
  };
};

// export const formatSourcedRouteData = (sourcedRouteData) => {
//   const features = [];

//   sourcedRouteData.forEach((route) => {
//     features.push({
//       type: "Feature",
//       properties: {
//         driver_id: route.driver_id,
//         alt_route_id: route.alt_route_id,
//         ride_id: route.ride_id,
//         frequency: route.frequency,
//       },
//       geometry: {
//         type: "LineString",
//         coordinates: route.coordinates.coordinates,
//       },
//     });
//   });

//   return {
//     type: "FeatureCollection",
//     name: "SourcedRouteData",
//     crs: {
//       type: "name",
//       properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
//     },
//     features,
//   };
// };

export const fetchDriverData = async (driverId) => {
  try {
    const { data, error } = await supabase
      .from("driver")
      .select("*")
      .filter("driver_id", "eq", driverId)
      .single();

    //console.log("Driver data:", data);
    if (error) {
      throw new Error("Failed to fetch driver data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching driver data:", error.message);
    throw error;
  }
};
