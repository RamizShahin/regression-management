import React from "react";
import { ProjectFormData } from "../validationSchema";
import styles from "../AddProjectForm.module.css";

type ReviewSubmitProps = {
  formData: ProjectFormData;
  // onSubmit: () => void;
  errors: Record<string, string>;
};

const ReviewSubmit: React.FC<ReviewSubmitProps> = ({
  formData,
  // onSubmit,
  errors,
}) => {
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className={styles.stepContainer}>
      <div className={styles.formSection}>
        <h3>Review and Submit Project</h3>

        {hasErrors && (
          <div className={styles.errorSummary}>
            <h4>Please fix the following errors before submitting:</h4>
            <ul>
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>
                  <strong>
                    {field
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </strong>{" "}
                  {message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.reviewSection}>
          <h4>Basic Information</h4>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Project Name:</span>
            <span className={styles.reviewValue}>{formData.name}</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Description:</span>
            <span className={styles.reviewValue}>
              {formData.description || "No description provided"}
            </span>
          </div>
        </div>

        <div className={styles.reviewSection}>
          <h4>Modules and Components</h4>
          {formData.modules.length === 0 ? (
            <div className={styles.emptyState}>No modules defined</div>
          ) : (
            formData.modules.map((module) => (
              <div key={module.id} className={styles.moduleReviewCard}>
                <h3 className={styles.moduleReviewName}>{module.name}</h3>
                <p className={styles.moduleReviewDescription}>
                  {module.description || "No description provided"}
                </p>

                <h3>Components:</h3>
                {module.components.length === 0 ? (
                  <div className={styles.emptyState}>No components defined</div>
                ) : (
                  <ul className={styles.componentReviewList}>
                    {module.components.map((component) => (
                      <li
                        key={component.id}
                        className={styles.componentReviewItem}
                      >
                        <strong>{component.name}</strong>
                        {component.description && (
                          <p>{component.description}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>

        <div className={styles.submitContainer}>
          {hasErrors && (
            <p className={styles.errorMessage}>
              Please go back to previous steps and fix errors before submitting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmit;
