import React from "react";
import { ProjectFormData } from "../validationSchema";

type ReviewSubmitProps = {
  formData: ProjectFormData;
  errors: Record<string, string>;
};

const ReviewSubmit: React.FC<ReviewSubmitProps> = ({ formData, errors }) => {
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Review and Submit Project</h2>

        {hasErrors && (
          <div className="bg-red-800 text-red-100 border border-red-600 rounded-md p-4 space-y-2">
            <h4 className="font-medium">Please fix the following errors before submitting:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>
                  <strong className="capitalize">{field.replace(/([A-Z])/g, " $1")}:</strong> {message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-gray-800 p-4 rounded-md border border-gray-700 space-y-2">
          <h3 className="text-lg font-medium text-white">Basic Information</h3>
          <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-300">
            <span className="font-medium w-36">Project Name:</span>
            <span>{formData.name}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-300">
            <span className="font-medium w-36">Description:</span>
            <span>{formData.description || "No description provided"}</span>
          </div>
        </div>

        {/* Modules */}
        <div className="bg-gray-800 p-4 rounded-md border border-gray-700 space-y-4">
          <h3 className="text-lg font-medium text-white">Modules and Components</h3>

          {formData.modules.length === 0 ? (
            <p className="text-sm text-gray-400">No modules defined</p>
          ) : (
            <div className="max-h-72 overflow-y-auto space-y-4 pr-2">
              {formData.modules.map((module) => (
                <div
                  key={module.id}
                  className="bg-gray-900 rounded-md p-4 border border-gray-700 text-gray-200"
                >
                  <h4 className="font-semibold text-white">{module.name}</h4>
                  <p className="text-sm text-gray-400 mb-2">
                    {module.description || "No description provided"}
                  </p>

                  <h5 className="text-sm font-medium text-white mb-1">Components:</h5>
                  {module.components.length === 0 ? (
                    <p className="text-sm text-gray-500">No components defined</p>
                  ) : (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                      {module.components.map((component) => (
                        <li key={component.id}>
                          <strong>{component.name}</strong>
                          {component.description && (
                            <p className="text-gray-400 text-xs">{component.description}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {hasErrors && (
          <p className="text-red-400 text-sm text-center">
            Please go back and fix all errors before submitting.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewSubmit;
