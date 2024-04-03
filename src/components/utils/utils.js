//utils.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qegghlcugbbvyuopfegq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZ2dobGN1Z2Jidnl1b3BmZWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ5NTU3NjMsImV4cCI6MjAxMDUzMTc2M30.HJf-DFvWbqRWqTIUjdJkeuQalXEAvqPfi-GN7lYQ-PY";
const supabase = createClient(supabaseUrl, supabaseKey);

export const getUserInputLevel = async () => {
  try {
    const userInput = window.prompt("Please enter the risk level (1-10):", "1");
    if (userInput === null) {
      throw new Error("User canceled input");
    }
    const level = parseInt(userInput);
    if (isNaN(level) || level < 1 || level > 10) {
      throw new Error("Invalid input. Please enter a number between 1 and 10.");
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
      throw new Error("Failed to call RPC: saving_floodzone_geom");
    }

    console.log("RPC: saving_floodzone_geom called successfully:", data);
    return data;
  } catch (error) {
    console.error("Error calling RPC: saving_floodzone_geom", error);
    throw error;
  }
};

export const fetchFloodzoneData = async () => {
  try {
    const { data, error } = await supabase
      .from("floodzone_geojson_view")
      .select("*");
    console.log("Floodzone data:", data);
    console.log("Floodzone error:", error);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching floodzone data:", error.message);
    throw error;
  }
};
