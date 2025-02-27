import React from "react";
import styles from "../AddUserForm.module.css";

interface AdditionalInfoProps {
  formData: {
    department: string;
    position: string;
    startDate: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className={styles.formFields}>
      <div className={styles.formGroup}>
        <label htmlFor="department">Department:</label>
        <input
          type="text"
          id="department"
          name="department"
          value={formData.department}
          onChange={onChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="position">Position:</label>
        <input
          type="text"
          id="position"
          name="position"
          value={formData.position}
          onChange={onChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
};

export default AdditionalInfo;
