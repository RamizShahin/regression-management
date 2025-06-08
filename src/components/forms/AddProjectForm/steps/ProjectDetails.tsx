import React from "react";
import { ProjectFormData } from "../validationSchema";

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
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Project Details</h2>
        <p className="text-sm text-gray-400 mt-1">
          Start by providing the basic information about the project.
        </p>
      </div>

      {/* Project Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-white flex items-center gap-2"
        >
          <span role="img" aria-label="folder">
            📂
          </span>
          Project Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Enter project name..."
            className={`w-full rounded-md px-3 py-2 text-sm bg-gray-800 text-white border ${
              errors.name ? "border-red-500" : "border-gray-600"
            } focus:outline-none focus:ring focus:ring-purple-500`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
      </div>

      {/* Project Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-white flex items-center gap-2"
        >
          <span role="img" aria-label="notepad">
            📝
          </span>
          Description
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Describe the project..."
            rows={5}
            className={`w-full rounded-md px-3 py-2 text-sm bg-gray-800 text-white border ${
              errors.description ? "border-red-500" : "border-gray-600"
            } focus:outline-none focus:ring focus:ring-purple-500`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
