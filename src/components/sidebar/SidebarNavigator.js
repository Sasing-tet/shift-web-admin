//sidebarNavigator.js
import React, { useState } from "react";
import { useRouter } from "next/router";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import Logout from "@mui/icons-material/Logout";
import Image from "next/image";
import shifticon from "../../assets/shifticon.png";
import { navData } from "./SidebarData";
import UploadContent from "../sidebar/sidebar_components/uploadContent";
import SettingsContent from "../sidebar/sidebar_components/settingsContent";
import styles from "@/styles/Sidebar.module.css";

export default function SidebarNavigator({
  cityVisibility,
  setCityVisibility,
  floodzoneData,
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(null);

  const toggleOpen = () => {
    setOpen(!open);
    if (!open) {
      setActiveNavItem(null);
    }
  };

  const handleNavItemClicked = (itemId) => {
    setOpen(true);
    setActiveNavItem(itemId);

    const sidebarItems = document.querySelectorAll(`.${styles.sideitem}`);
    sidebarItems.forEach((item) => {
      item.style.backgroundColor = "transparent";
    });

    const clickedItem = document.querySelector(
      `.${styles.sideitem}[data-id="${itemId}"]`
    );
    clickedItem.style.backgroundColor = "#0e256a";
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const fileContent = await file.text();

        const level = await getUserInputLevel();

        const { name, crs, description, coordinates_text } =
          extractDataFromGeoJSON(fileContent);

        await callSavingFloodzoneGeomRPC({
          name,
          level,
          crs,
          description,
          coordinates_text,
        });

        console.log("GeoJSON uploaded successfully!");
      } catch (error) {
        console.error("Error uploading GeoJSON:", error);
      }
    }
  };

  const toggleLogout = () => {
    router.push("/loginPage");
  };

  const toggleCityVisibility = (cityName) => {
    setCityVisibility((prevVisibility) => ({
      ...prevVisibility,
      [cityName]: !prevVisibility[cityName],
    }));
  };

  const toggleAllVisibility = () => {
    const allVisible = Object.values(cityVisibility).every(
      (visible) => visible
    );
    const newVisibility = {};

    floodzoneData.forEach((city) => {
      newVisibility[city.properties.name] = !allVisible;
    });

    setCityVisibility(newVisibility);
  };

  const renderNavContent = () => {
    if (!open || activeNavItem === null) return null;

    switch (activeNavItem) {
      case 1:
        return <UploadContent handleUpload={handleUpload} />;
      case 2:
        return <div>Statistics Content</div>;
      case 3:
        return (
          <SettingsContent
            cityVisibility={cityVisibility}
            toggleCityVisibility={toggleCityVisibility}
            floodzoneData={floodzoneData}
            toggleAllVisibility={toggleAllVisibility}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.sidebarContainer}>
      <div className={open ? styles.sidenav : styles.sidenavClosed}>
        <div className={styles.spacebetweenTopAndBottom}>
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
            <div
              className={open ? styles.sidebarItems : styles.sidebarItemsClosed}
            >
              {navData.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.sideitem} ${
                    activeNavItem === item.id ? "active" : ""
                  }`}
                  onClick={() => handleNavItemClicked(item.id)}
                  data-id={item.id}
                >
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
            </div>
            <div className={styles.navContents}>{renderNavContent()}</div>
          </div>
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
