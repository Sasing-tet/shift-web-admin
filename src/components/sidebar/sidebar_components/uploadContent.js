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

      const reader = new FileReader();
      reader.onload = async (e) => {
        const geoJSONData = e.target.result;
        const { name, crs, description, coordinates_text } =
          extractDataFromGeoJSON(geoJSONData);

        const level = await getUserInputLevel(
          setSnackbarSeverity,
          setSnackbarMessage,
          setSnackbarOpen
        );
        if (!level) return;

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
        >
          Proceed Upload
        </button>
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
