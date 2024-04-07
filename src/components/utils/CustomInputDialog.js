// CustomInputDialogBox.js
import React, { useState } from "react";
import CustomModal from "../customdialogbox/CustomModal";

const CustomInputDialog = ({ onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue("");
    onClose();
  };

  return (
    <CustomModal isOpen={true} onClose={onClose}>
      <div>
        <h2>Please enter the risk level (1-10):</h2>
        <input type="number" value={inputValue} onChange={handleInputChange} />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </CustomModal>
  );
};

export default CustomInputDialog;
