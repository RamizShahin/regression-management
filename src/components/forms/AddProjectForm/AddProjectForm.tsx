import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  projectFormSchema,
  type ProjectFormData,
  type ModuleData,
} from "./validationSchema";
import { ZodError } from "zod";
import styles from "./AddProjectForm.module.css";
import ProjectDetails from "./steps/ProjectDetails";
import ModulesDefinition from "./steps/ModulesDefinition";
import ComponentsDefinition from "./steps/ComponentsDefinition";
import ReviewSubmit from "./steps/ReviewSubmit";
import authService from "../../../services/auth";

const INITIAL_FORM_DATA: ProjectFormData = {
  name: "",
  description: "",
  modules: [],
};

// Step definitions
const STEPS = [
  "Project Details",
  "Define Modules",
  "Define Components",
  "Review & Submit",
];

const AddProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProjectFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleModulesChange = (modules: ModuleData[]) => {
    setFormData((prev) => ({
      ...prev,
      modules,
    }));
    // Clear error when modules are updated
    if (errors.modules) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.modules;
        return newErrors;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    try {
      switch (currentStep) {
        case 0: // Project Details
          projectFormSchema
            .pick({ name: true, description: true })
            .parse(formData);
          break;
        case 1: // Define Modules
          // Optional validation for modules step
          break;
        case 2: // Define Components
          // Optional validation for components step
          break;
        case 3: // Review & Submit
          projectFormSchema.parse(formData);
          break;
      }
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNextStep = () => {
    const isValid = validateCurrentStep();
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const validatedData = projectFormSchema.parse(formData);
      console.log("Project created:", validatedData);
      await authService.makeAuthenticatedRequest("/api/projects/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });
      navigate("/projects");
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProjectDetails
            formData={formData}
            onChange={handleInputChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <ModulesDefinition
            formData={formData}
            onModulesChange={handleModulesChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <ComponentsDefinition
            formData={formData}
            onModulesChange={handleModulesChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <ReviewSubmit
            formData={formData}
            // onSubmit={handleSubmit}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <label className={styles.label1}>Add New Project</label>
        <button
          className={styles.backButton}
          onClick={() => navigate("/projects")}
        >
          Back to Projects
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <div className={styles.stepIndicator}>
            {STEPS.map((step, index) => (
              <div
                key={step}
                className={`${styles.stepItem} ${
                  currentStep === index ? styles.activeStep : ""
                } ${currentStep > index ? styles.completedStep : ""}`}
              >
                <div className={styles.stepNumber}>{index + 1}</div>
                <div className={styles.stepName}>{step}</div>
              </div>
            ))}
          </div>

          {renderStep()}

          <div className={styles.stepNavigation}>
            {currentStep > 0 && (
              <button
                type="button"
                className={styles.prevButton}
                onClick={handlePrevStep}
              >
                Previous Step
              </button>
            )}

            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                className={styles.nextButton}
                onClick={handleNextStep}
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={Object.keys(errors).length > 0}
              >
                Submit Project
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectForm;
