import React from "react";
import styles from "./LongShortAnswerSwitch.module.css";

export const LongShortAnswerSwitch = ({
  isChecked,
  handleChange,
}: {
  isChecked: boolean;
  handleChange: () => void;
}) => {
  return (
    <div className={styles.checkboxContainer}>
      <label className={styles.customCheckbox}>
        <input
          type="checkbox"
          id="longAnswer"
          onChange={handleChange}
          checked={isChecked}
        />
        <span className={styles.checkmark}></span>
        <span className={styles.labelText}>Long Answer</span>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
      </label>
    </div>
  );
};
