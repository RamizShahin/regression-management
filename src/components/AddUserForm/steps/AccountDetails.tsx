import React from "react";
import styles from "../AddUserForm.module.css";

interface AccountDetailsProps {
  formData: {
    username: string;
    password: string;
    role: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className={styles.formFields}>
      <div className={styles.formGroup}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={onChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="role">Role:</label>
        <input
          type="text"
          id="role"
          name="role"
          value={formData.role}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
};

export default AccountDetails;
