// CustomModal.js
import React from "react";
//import styles from "./CustomModal.module.css";

const CustomModal = ({ isOpen, onClose, children }) => {
  return (
    <div className={`${styles.modal} ${isOpen ? styles.open : ""}`}>
      <div className={styles.modalContent}>{children}</div>
    </div>
  );
};

export default CustomModal;
