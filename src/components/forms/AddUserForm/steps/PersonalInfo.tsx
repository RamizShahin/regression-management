import React from "react";
import { UserFormData } from "../validationSchema";
import styles from "../AddUserForm.module.css";

type PersonalInfoProps = {
  formData: UserFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProjectsChange?: (selectedProjects: string[]) => void;
  errors: Record<string, string>;
};

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  formData,
  onChange,
  errors,
}) => {
  return (
    <div className={styles.stepContainer}>
      <div className={styles.formGroup}>
        <label htmlFor="fullName">
          <span className={styles.labelIcon}>👤</span>
          Full Name
        </label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            className={errors.fullName ? styles.inputError : ""}
          />
          {errors.fullName && (
            <div className={styles.error}>{errors.fullName}</div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">
          <span className={styles.labelIcon}>✉️</span>
          Email
        </label>
        <div className={styles.inputWrapper}>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className={errors.email ? styles.inputError : ""}
          />
          {errors.email && <div className={styles.error}>{errors.email}</div>}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">
          <span className={styles.labelIcon}>📱</span>
          Phone Number
        </label>
        <div className={styles.inputWrapper}>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className={errors.phone ? styles.inputError : ""}
          />
          {errors.phone && <div className={styles.error}>{errors.phone}</div>}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
