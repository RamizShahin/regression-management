// ProjectAssignment.tsx
import React, { useState, useEffect } from "react";
import { UserFormData } from "../validationSchema";
import authService from "../../../../services/auth";

interface ProjectType {
  project_id: number;
  project_name: string;
  project_description: string;
}

interface ProjectAssignmentProps {
  formData: UserFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onProjectsChange: (selectedProjects: string[]) => void;
  errors: Record<string, string>;
}

const ProjectAssignment: React.FC<ProjectAssignmentProps> = ({
  formData,
  onChange,
  onProjectsChange,
  errors,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableProjects, setAvailableProjects] = useState<ProjectType[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authService.makeAuthenticatedRequest("/api/projects");
        const jsonData = await response.json();
        setAvailableProjects(jsonData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = availableProjects.filter((project) =>
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchTerm, availableProjects]);

  const handleCheckboxChange = (projectId: string) => {
    const updatedProjects = formData.projects.includes(projectId)
      ? formData.projects.filter((id) => id !== projectId)
      : [...formData.projects, projectId];

    onProjectsChange(updatedProjects);
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="projectSearch" className="block text-sm font-medium text-gray-300 mb-1">
          Search Projects
        </label>
        <input
          id="projectSearch"
          type="text"
          placeholder="Type to search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md bg-gray-800 text-white px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {errors.projects && <div className="text-red-500 text-sm">{errors.projects}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto pr-2">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <label
              key={project.project_id}
              className="flex items-center space-x-3 bg-gray-800 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-700 transition"
            >
              <input
                type="checkbox"
                checked={formData.projects.includes(project.project_id.toString())}
                onChange={() => handleCheckboxChange(project.project_id.toString())}
                className="accent-purple-500 w-4 h-4"
              />
              <span className="text-white text-sm">{project.project_name}</span>
            </label>
          ))
        ) : (
          <p className="text-gray-400 text-sm col-span-full">No projects found</p>
        )}
      </div>

      {formData.projects.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-md">
          <h3 className="text-white font-medium mb-2">
            Selected Projects ({formData.projects.length})
          </h3>
          <ul className="space-y-1 text-sm text-white">
            {formData.projects.map((projectId) => {
              const project = availableProjects.find(
                (p) => p.project_id.toString() === projectId
              );
              return project ? (
                <li key={projectId} className="flex justify-between items-center">
                  <span>{project.project_name}</span>
                  <button
                    onClick={() => handleCheckboxChange(projectId)}
                    className="text-red-400 hover:text-red-600 text-sm"
                    type="button"
                  >
                    ✕
                  </button>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectAssignment;
