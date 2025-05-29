import React, { useState, useEffect } from "react";
import { UserFormData } from "../validationSchema";
import styles from "../AddUserForm.module.css";
import authService from "../../../../services/auth";

type ProjectType = {
  project_id: number;
  project_name: string;
  project_description: string;
};

type ProjectAssignmentProps = {
  formData: UserFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onProjectsChange: (selectedProjects: string[]) => void;
  errors: Record<string, string>;
};

const ProjectAssignment: React.FC<ProjectAssignmentProps> = ({
  formData,
  onChange,
  onProjectsChange,
  errors,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableProjects, setAvailableProjects] = useState<ProjectType[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectType[]>([]);

  // Normally you would fetch this from an API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authService.makeAuthenticatedRequest(
          "/api/projects"
        );
        const jsonData = await response.json();
        setAvailableProjects(jsonData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = availableProjects.filter((project) =>
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(availableProjects);
    }
  }, [searchTerm, availableProjects]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckboxChange = (projectId: string) => {
    let updatedProjects: string[];

    if (formData.projects.includes(projectId)) {
      // Remove if already selected
      updatedProjects = formData.projects.filter((id) => id !== projectId);
    } else {
      // Add if not selected
      updatedProjects = [...formData.projects, projectId];
    }

    onProjectsChange(updatedProjects);
  };

  const shouldShowProjects = searchTerm.trim().length >= 0;

  return (
    <div className={styles.stepContainer}>
      <div className={styles.formGroup}>
        <label htmlFor="projectSearch">
          <span className={styles.labelIcon}>🔍</span>
          Search Projects
        </label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            id="projectSearch"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Type to search projects..."
            className={styles.fancySearchInput}
          />
          {/* <span className={styles.searchIcon}>🔍</span> */}
        </div>
      </div>

      {shouldShowProjects && (
        <>
          <div className={styles.formGroup}>
            <label>
              <span className={styles.labelIcon}>📋</span>
              Projects
            </label>
            {errors.projects && (
              <div className={styles.error}>{errors.projects}</div>
            )}
          </div>

          <div className={styles.projectGrid}>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div key={project.project_id} className={styles.projectCard}>
                  <label className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      checked={formData.projects.includes(
                        project.project_id.toString()
                      )}
                      onChange={() =>
                        handleCheckboxChange(project.project_id.toString())
                      }
                    />
                    {/* <div className={styles.projectCardContent}> */}
                    <span className={styles.projectName}>
                      {project.project_name}
                    </span>
                    {/* </div> */}
                  </label>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>No projects found</div>
            )}
          </div>
        </>
      )}

      {formData.projects.length > 0 && (
        <div className={styles.selectedProjectsSummary}>
          <h3>Selected Projects ({formData.projects.length})</h3>
          <ul>
            {formData.projects.map((projectId) => {
              const project = availableProjects.find(
                (p) => p.project_id.toString() === projectId
              );
              return project ? (
                <li key={projectId}>
                  <span className={styles.selectedProjectName}>
                    {project.project_name}
                  </span>
                  <button
                    className={styles.removeProjectBtn}
                    onClick={() => handleCheckboxChange(projectId)}
                    type="button"
                    aria-label="Remove project"
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
