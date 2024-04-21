import React, { useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import styles from "@/styles/Home.module.css";
import {
  callSavingFloodzoneGeomRPC,
  extractDataFromGeoJSON,
  getUserInputLevel,
} from "../../utils/utils";

const UploadContent = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [parametersChecked, setParametersChecked] = useState({
    name: false,
    crs: false,
    description: false,
    coordinates_text: false,
    level: false,
  });
  const [showParameters, setShowParameters] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (selectedFile) => {
    try {
      if (!selectedFile) {
        throw new Error("Please select a file.");
      }

      setUploading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const geoJSONData = e.target.result;
        const { name, crs, description, coordinates_text } =
          extractDataFromGeoJSON(geoJSONData);

        setParametersChecked({
          name: !!name,
          crs: !!crs,
          description: !!description,
          coordinates_text: !!coordinates_text,
        });

        const level = await getUserInputLevel(
          setSnackbarSeverity,
          setSnackbarMessage,
          setSnackbarOpen
        );
        if (!level) return;

        setParametersChecked((prevChecked) => ({
          ...prevChecked,
          level: true,
        }));

        const result = await callSavingFloodzoneGeomRPC({
          name,
          level,
          crs,
          description,
          coordinates_text,
        });

        if (result.error) {
          setSnackbarSeverity("error");
          setSnackbarMessage(result.error);
          setSnackbarOpen(true);
        } else {
          setSnackbarSeverity("success");
          setSnackbarMessage("Upload successful!");
          setSnackbarOpen(true);
        }
      };

      reader.readAsText(selectedFile);
    } catch (error) {
      console.error("Error uploading file:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Upload failed!");
      setSnackbarOpen(true);
    } finally {
      setUploading(false); // Set uploading state to false when upload is complete
      setShowParameters(true);
    }
  };

  return (
    <>
      <div className={styles.uploadContentContainer}>
        <label className={styles.sideitem}></label>
        <input
          type="file"
          accept=".geojson"
          className={styles.uploadInput}
          id="fileInput"
          onChange={handleFileInputChange}
        />
        <button
          className={styles.proceedUpload}
          onClick={() => handleUpload(selectedFile)}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Proceed Upload"}
        </button>
        <br />
        {showParameters && (
          <table className={styles.parametersTable}>
            <thead>
              <tr>
                <th>Parameters</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(parametersChecked).map(([parameter, checked]) => (
                <tr key={parameter}>
                  <td>{parameter}</td>
                  <td className={styles.tableStatus}>
                    {checked ? "✅" : "❌"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default UploadContent;
