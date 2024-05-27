import React from "react";
import styles from "./ThemeToggler.module.css";

export const ThemeToggler = ({
  isChecked,
  handleChange,
}: {
  isChecked: boolean;
  handleChange: () => void;
}) => {
  return (
    <div className={styles.toggleContainer}>
      <input
        type="checkbox"
        id="check"
        className={styles.toggle}
        onChange={handleChange}
        checked={isChecked}
      />
      <label htmlFor="check">&nbsp;Dark Mode</label>
    </div>
  );
};
