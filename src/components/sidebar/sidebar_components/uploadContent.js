// UploadContent.js
import React from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import styles from "../../../styles/Sidebar.module.css";

const UploadContent = ({ handleUpload }) => {
  return (
    <label className={styles.sideitem}>
      <div className={styles.navItemIcon}>
        <UploadFileIcon />
      </div>
      <input
        type="file"
        accept=".geojson"
        className={styles.uploadInput}
        id="fileInput"
        onChange={handleUpload}
      />
      <div className={styles.linkText}>Upload GeoJSON</div>
    </label>
  );
};

export default UploadContent;
