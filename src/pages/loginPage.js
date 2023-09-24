// LoginPage.js
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Login.module.css";
import Image from "next/image";
import shiftLoginImage from "../assets/web login image2.jpg";
import shiftLogoWithText from "../assets/capstone logo with text.png";
import shiftLoginExtraImg from "../assets/login extra1.png";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    router.push("/homePage");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginFormContainer}>
        <div>
          <Image
            className={styles.shiftLogo}
            src={shiftLogoWithText}
            alt="shift logo with text"
          />
        </div>
        <div className={styles.heroTextContainer}>
          <p className={styles.heroHeaderText}>YOUR TRAVEL COMPANION</p>
          <p className={styles.heroText}>SHIFT gears</p>
          <p className={styles.heroText}>for Safer Travels.</p>
          <p className={styles.heroTextDescription}>
            Weather-Informed Routes for Flood Susceptible Destinations
          </p>
        </div>
        <form className={styles.loginForm}>
          <div className={styles.loginFormFields}>
            <table>
              <tr className={styles.rowContainer}>
                <label className={styles.fieldLabel} htmlFor="username">
                  Username:
                </label>
              </tr>
              <tr className={styles.rowContainer}>
                <input
                  className={styles.fieldInput}
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </tr>
              <tr className={styles.rowContainer}>
                <label className={styles.fieldLabel} htmlFor="password">
                  Password:
                </label>
              </tr>
              <tr className={styles.rowContainer}>
                <input
                  className={styles.fieldInput}
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </tr>
              <tr className={styles.rowContainer}>
                <label className={styles.fieldLabelBtn}>Forgot password?</label>
              </tr>
            </table>
            <div className={styles.loginButtonContainer}>
              <button
                className={styles.loginButton}
                type="button"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </div>
          <div className={styles.loginExtraImageContainer}>
            <Image
              className={styles.loginExtraImage}
              src={shiftLoginExtraImg}
              alt="shift login image"
            />
          </div>
        </form>
      </div>
      <div className={styles.loginImageContainer}>
        <Image
          className={styles.loginImage}
          src={shiftLoginImage}
          alt="shift login image"
        />
      </div>
    </div>
  );
};

export default LoginPage;
