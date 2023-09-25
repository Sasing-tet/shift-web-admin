// LoginPage.js
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Login.module.css";
import Image from "next/image";
import shiftLoginImage from "../assets/web login image2.jpg";
import shiftLogoWithText from "../assets/capstone logo with text white.png";
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
        <div className={styles.loginFormFields}>
          <form className={styles.loginForm}>
            <label className={styles.fieldLabel} htmlFor="username">
              Username:
            </label>
            <input
              className={styles.fieldInput}
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className={styles.fieldLabel} htmlFor="password">
              Password:
            </label>
            <input
              className={styles.fieldInput}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className={styles.fieldLabelBtn}>Forgot password?</label>

            <div className={styles.loginButtonContainer}>
              <button
                className={styles.loginButton}
                type="button"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </form>
          <div className={styles.loginExtraImageContainer}>
            <Image
              className={styles.loginExtraImage}
              src={shiftLoginExtraImg}
              alt="shift login image"
            />
          </div>
        </div>
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
