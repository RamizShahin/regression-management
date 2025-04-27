import React from "react";
import { ProjectFormData } from "../validationSchema";
import styles from "../AddProjectForm.module.css";

type ProjectDetailsProps = {
  formData: ProjectFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  errors: Record<string, string>;
};

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  formData,
  onChange,
  errors,
}) => {
  return (
    <div className={styles.stepContainer}>
      <h2>Project Details</h2>
      <p className={styles.stepDescription}>
        Start by providing the basic information about the project.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="name">
          <span className={styles.labelIcon}>📂</span>
          Project Name
        </label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            className={errors.name ? styles.inputError : ""}
            placeholder="Enter project name..."
          />
          {errors.name && <div className={styles.error}>{errors.name}</div>}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">
          <span className={styles.labelIcon}>📝</span>
          Description
        </label>
        <div className={styles.inputWrapper}>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            className={errors.description ? styles.inputError : ""}
            placeholder="Describe the project..."
            rows={5}
          />
          {errors.description && (
            <div className={styles.error}>{errors.description}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
