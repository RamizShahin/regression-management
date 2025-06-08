import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
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
    { title: "Personal Information", component: PersonalInfo },
    { title: "Account Details", component: AccountDetails },
    { title: "Project Assignment", component: ProjectAssignment },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  const handleProjectChange = (selectedProjects: string[]) => {
    setFormData((prev) => ({ ...prev, projects: selectedProjects }));
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
      if (currentStep === 0)
        userFormSchema
          .pick({ fullName: true, email: true, phone: true })
          .parse(formData);
      else if (currentStep === 1)
        userFormSchema
          .pick({ password: true, role: true })
          .parse(formData);
      else if (currentStep === 2)
        userFormSchema
          .pick({ projects: true })
          .parse(formData);
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
    if (validateStep() && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      const validatedData = userFormSchema.parse(formData);
      await authService.makeAuthenticatedRequest("/api/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb + Heading */}
        <div>
          {/* Mobile Back */}
          <nav aria-label="Back" className="sm:hidden">
            <Link
              to="/users"
              className="flex items-center text-sm font-medium text-gray-400 hover:text-gray-200"
            >
              <ChevronLeftIcon
                className="mr-1 -ml-1 size-5 shrink-0 text-gray-500"
                aria-hidden="true"
              />
              Back
            </Link>
          </nav>

          {/* Desktop Breadcrumb */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex">
            <ol role="list" className="flex items-center space-x-4">
              <li>
                <div className="flex">
                  <Link
                    to="/users"
                    className="text-sm font-medium text-gray-400 hover:text-gray-200"
                  >
                    Users
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon
                    className="size-5 shrink-0 text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="ml-4 text-sm font-medium text-gray-400">
                    Add New User
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <h2 className="text-xl font-medium mb-4">Credentials</h2>
            <div className="flex flex-col gap-3">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`text-left px-4 py-2 rounded-md transition ${
                    currentStep === index
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </div>
          </aside>

          <main className="lg:w-3/4">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-md">
              <h2 className="text-2xl font-semibold mb-6">
                {steps[currentStep].title}
              </h2>
              <form className="space-y-6">
                <CurrentStepComponent
                  formData={formData}
                  onChange={handleInputChange}
                  onProjectsChange={handleProjectChange}
                  errors={errors}
                />
                <div className="pt-6 flex justify-center gap-4">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-md"
                    >
                      Back
                    </button>
                  )}

                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-2 rounded-md"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-2 rounded-md"
                    >
                      Add User
                    </button>
                  )}
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;
