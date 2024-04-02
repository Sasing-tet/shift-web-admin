// SidebarNavigator.js
import { useState } from "react";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import Logout from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import { uploadGeoJSONToSupabase } from "../utils/utils";
import styles from "@/styles/Sidebar.module.css";
import Image from "next/image";
import shifticon from "../../assets/shifticon.png";
import { navData } from "./SidebarData";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function SidebarNavigator() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const fileContent = await file.text(); // Read the file content
        await uploadGeoJSONToSupabase(fileContent); // Upload GeoJSON to Supabase
        // Handle successful upload
        console.log("GeoJSON uploaded successfully!");
      } catch (error) {
        console.error("Error uploading GeoJSON:", error);
        // Handle upload error
      }
    }
  };

  const toggleLogout = () => {
    router.push("/loginPage");
  };

  const handleUploadButtonClick = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
  };

  const handleProceedButtonClick = async () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      try {
        const fileContent = await file.text(); // Read the file content
        await uploadGeoJSONToSupabase(fileContent); // Upload GeoJSON to Supabase
        console.log("GeoJSON uploaded successfully!");
        console.log("Proceed button clicked!");
      } catch (error) {
        console.error("Error uploading GeoJSON:", error);
        // Handle upload error
      }
    } else {
      console.log("No file selected!");
    }
  };
  return (
    <div className={styles.sidebarContainer}>
      {/* Sidebar content */}
      <div className={open ? styles.sidenav : styles.sidenavClosed}>
        <div className={styles.spacebetweenTopAndBottom}>
          {/* Logo and toggle button */}
          <div>
            <div
              className={
                open ? styles.sideNavHeader : styles.sideNavHeaderClosed
              }
            >
              <div
                className={
                  open ? styles.sideNavLogoText : styles.sideNavLogoTextClosed
                }
              >
                <Image
                  className={
                    open ? styles.SidenavLogo : styles.SidenavLogoClosed
                  }
                  src={shifticon}
                  alt="shift project logo"
                />
                <span
                  className={open ? styles.logoText : styles.logoTextClosed}
                >
                  SHIFT
                </span>
              </div>
              <button
                className={open ? styles.menuBtn : styles.menuBtnClosed}
                onClick={toggleOpen}
              >
                {open ? (
                  <KeyboardDoubleArrowLeftIcon />
                ) : (
                  <KeyboardDoubleArrowRightIcon />
                )}
              </button>
            </div>
            {/* Sidebar navigation items */}
            <div
              className={open ? styles.sidebarItems : styles.sidebarItemsClosed}
            >
              {navData.map((item) => (
                <div key={item.id} className={styles.sideitem}>
                  <div
                    className={
                      open ? styles.navItemIcon : styles.navItemIconClosed
                    }
                  >
                    {item.icon}
                  </div>
                  <div
                    className={open ? styles.linkText : styles.linkTextClosed}
                  >
                    {item.text}
                  </div>
                </div>
              ))}
              {/* File upload button */}
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
                  style={{ display: "none" }} // Hide the file input
                />
                <div className={styles.linkText}>Upload GeoJSON</div>
              </label>

              {/* Proceed button */}
              <button
                className={styles.proceedButton}
                onClick={handleProceedButtonClick}
              >
                Proceed with Upload
              </button>
            </div>
          </div>
          {/* Logout button */}
          <div
            className={
              open ? styles.sidenavBottomBar : styles.sidenavBottomBarClosed
            }
          >
            <button className={styles.logOutBtn} onClick={toggleLogout}>
              <Logout />
              <span
                className={open ? styles.logoutText : styles.logoutTextClosed}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
