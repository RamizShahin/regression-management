import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddUserForm.module.css";
import PersonalInfo from "./steps/PersonalInfo";
import AccountDetails from "./steps/AccountDetails";
import ProjectAssignment from "./steps/ProjectAssignment";
import { userFormSchema, type UserFormData } from "./validationSchema";
import { ZodError } from "zod";
import authService from "../../../services/auth";

const INITIAL_FORM_DATA: UserFormData = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  role: "user",
  projects: [],
};

const AddUserForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    {
      title: "Personal Information",
      component: PersonalInfo,
    },
    {
      title: "Account Details",
      component: AccountDetails,
    },
    {
      title: "Project Assignment",
      component: ProjectAssignment,
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  const handleProjectChange = (selectedProjects: string[]) => {
    setFormData((prev) => ({
      ...prev,
      projects: selectedProjects,
    }));

    // Clear error when projects are selected
    if (errors.projects) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.projects;
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    try {
      switch (currentStep) {
        case 0:
          userFormSchema
            .pick({ fullName: true, email: true, phone: true })
            .parse(formData);
          break;
        case 1:
          userFormSchema.pick({ password: true, role: true }).parse(formData);
          break;
        case 2:
          userFormSchema.pick({ projects: true }).parse(formData);
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

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = userFormSchema.parse(formData);
      console.log("Form submitted:", validatedData);
      await authService.makeAuthenticatedRequest("/api/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });
      navigate("/users");
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

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <label className={styles.label1}>Add New User</label>
        <button
          className={styles.backButton}
          onClick={() => navigate("/users")}
        >
          Back to Users
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <label className={styles.label2}>Credentials</label>
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`${styles.sidebarItem} ${
                currentStep === index ? styles.active : ""
              }`}
              onClick={() => setCurrentStep(index)}
            >
              {step.title}
            </div>
          ))}
        </div>

        <div className={styles.formSection}>
          <h2>{steps[currentStep].title}</h2>
          <form className={styles["add-user-form"]} onSubmit={handleSubmit}>
            {currentStep === 2 ? (
              <ProjectAssignment
                formData={formData}
                onChange={handleInputChange}
                onProjectsChange={handleProjectChange}
                errors={errors}
              />
            ) : (
              <CurrentStepComponent
                formData={formData}
                onChange={handleInputChange}
                onProjectsChange={handleProjectChange}
                errors={errors}
              />
            )}
            {currentStep < steps.length - 1 && (
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={handleNext}
              >
                Next
              </button>
            )}
            {currentStep === steps.length - 1 && (
              <button type="submit" className={styles.btnPrimary}>
                Add User
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;
