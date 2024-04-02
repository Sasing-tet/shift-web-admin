import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qegghlcugbbvyuopfegq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZ2dobGN1Z2Jidnl1b3BmZWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ5NTU3NjMsImV4cCI6MjAxMDUzMTc2M30.HJf-DFvWbqRWqTIUjdJkeuQalXEAvqPfi-GN7lYQ-PY";
const supabase = createClient(supabaseUrl, supabaseKey);

export const validateGeoJSON = (geoJSONData) => {
  try {
    const geoJSON = JSON.parse(geoJSONData);
    const features = geoJSON.features;
    for (const feature of features) {
      if (
        !feature.properties.name ||
        !feature.properties.level ||
        !feature.properties.crs ||
        !feature.properties.description ||
        !feature.properties.coordinates_text
      ) {
        return { error: true, message: "GeoJSON is missing required fields." };
      }
    }
    return { error: false };
  } catch (error) {
    return { error: true, message: "Invalid GeoJSON format." };
  }
};

export const uploadGeoJSONToSupabase = async (geoJSONData) => {
  try {
    // Parse GeoJSON data
    const geoJSON = JSON.parse(geoJSONData);

    // Insert GeoJSON data into Supabase table
    const { data, error } = await supabase.from("geojson_data").insert(geoJSON);

    if (error) {
      throw new Error("Failed to upload GeoJSON to Supabase");
    }

    console.log("GeoJSON uploaded successfully:", data);
    return data;
  } catch (error) {
    console.error("Error uploading GeoJSON to Supabase:", error);
    throw error;
  }
};
