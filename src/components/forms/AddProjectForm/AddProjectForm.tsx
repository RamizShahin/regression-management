import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  projectFormSchema,
  type ProjectFormData,
  type ModuleData,
} from "./validationSchema";
import { ZodError } from "zod";
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleModulesChange = (modules: ModuleData[]) => {
    setFormData((prev) => ({ ...prev, modules }));
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
        case 0:
          projectFormSchema.pick({ name: true, description: true }).parse(formData);
          break;
        case 3:
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
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const validatedData = projectFormSchema.parse(formData);
      await authService.makeAuthenticatedRequest("/api/projects/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Breadcrumb + Heading */}
      <div className="mb-8">
        {/* Mobile Back */}
        <nav aria-label="Back" className="sm:hidden mb-2">
          <button
            onClick={() => navigate("/projects")}
            className="flex items-center text-sm font-medium text-gray-400 hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-1 -ml-1 h-5 w-5 shrink-0 text-gray-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
        </nav>

        {/* Desktop Breadcrumb */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex mb-2">
          <ol className="flex items-center space-x-4">
            <li>
              <button
                onClick={() => navigate("/projects")}
                className="text-sm font-medium text-gray-400 hover:text-gray-200"
              >
                Projects
              </button>
            </li>
            <li className="flex items-center">
              <svg
                className="h-5 w-5 text-gray-500 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414L13.414 10l-4.707 4.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-gray-400">Add New Project</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-between mb-8">
        {STEPS.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2
              ${currentStep === index
                  ? "bg-purple-600 text-white border-purple-600"
                  : currentStep > index
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-gray-800 text-gray-400 border-gray-600"
              }`}
            >
              {index + 1}
            </div>
            <div className="mt-2 text-xs text-gray-300">{step}</div>
          </div>
        ))}
      </div>

      {/* Form Section */}
      <div className="bg-gray-900 rounded-lg p-6 shadow-md">
        {renderStep()}

        <div className="mt-6 flex justify-between">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-sm"
            >
              Previous Step
            </button>
          )}
          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white text-sm"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={Object.keys(errors).length > 0}
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
            >
              Submit Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProjectForm;
