import React from "react";
import styles from "../AddUserForm.module.css";

interface PersonalInfoProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  formData,
  onChange,
  errors,
}) => {
  return (
    <div className={styles.formFields}>
      <div className={styles.formGroup}>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          required
          className={errors.firstName ? styles.inputError : ""}
        />
        {errors.firstName && (
          <span className={styles.errorMessage}>{errors.firstName}</span>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          required
          className={errors.lastName ? styles.inputError : ""}
        />
        {errors.lastName && (
          <span className={styles.errorMessage}>{errors.lastName}</span>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          required
          className={errors.email ? styles.inputError : ""}
        />
        {errors.email && (
          <span className={styles.errorMessage}>{errors.email}</span>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
