import React from "react";
import { UserFormData } from "../validationSchema";
import styles from "../AddUserForm.module.css";

type AccountDetailsProps = {
  formData: UserFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onProjectsChange?: (selectedProjects: string[]) => void;
  errors: Record<string, string>;
};

const AccountDetails: React.FC<AccountDetailsProps> = ({
  formData,
  onChange,
  errors,
}) => {
  return (
    <div className={styles.stepContainer}>
      <div className={styles.formGroup}>
        <label htmlFor="password">
          <span className={styles.labelIcon}>🔒</span>
          Password
        </label>
        <div className={styles.inputWrapper}>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            className={errors.password ? styles.inputError : ""}
          />
          {errors.password && (
            <div className={styles.error}>{errors.password}</div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="role">
          <span className={styles.labelIcon}>👑</span>
          Role
        </label>
        <div className={styles.inputWrapper}>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={onChange}
            className={errors.role ? styles.inputError : ""}
          >
            <option value="">Select a role</option>
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </select>
          {errors.role && <div className={styles.error}>{errors.role}</div>}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
