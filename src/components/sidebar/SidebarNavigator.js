import { useState } from "react";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import Logout from "@mui/icons-material/Logout";
import { navData } from "./SidebarData";
import styles from "@/styles/Sidebar.module.css";
import Image from "next/image";
import shifticon from "../../assets/shifticon.png";
import { useRouter } from "next/router";

export default function Sidenav() {
  const router = useRouter();
  const [open, setopen] = useState(false);

  const toggleOpen = () => {
    setopen(!open);
  };

  const toggleLogout = () => {
    router.push("/loginPage");
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
              {navData.map((item) => {
                return (
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
                );
              })}
            </div>
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
