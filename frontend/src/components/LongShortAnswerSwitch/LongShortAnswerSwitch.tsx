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
    <div className={styles.togglContainer}>
      <input
        type="checkbox"
        id="check"
        className={styles.toggle}
        onChange={handleChange}
        checked={isChecked}
      />
      <label htmlFor="check">Long Answer</label>
    </div>
  );
};
