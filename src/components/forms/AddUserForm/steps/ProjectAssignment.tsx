import React, { useState, useEffect } from "react";
import { UserFormData } from "../validationSchema";
import styles from "../AddUserForm.module.css";

type ProjectType = {
  id: number;
  name: string;
  status: string;
  deadline: string;
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
  useEffect(() => {
    // Mock data - in a real app, you would fetch from API
    const mockProjects = [
      {
        id: 1,
        name: "Website Redesign",
        status: "In Progress",
        deadline: "2025-03-15",
      },
      {
        id: 2,
        name: "Mobile App Development",
        status: "Completed",
        deadline: "2024-12-01",
      },
      {
        id: 3,
        name: "Cloud Migration",
        status: "In Progress",
        deadline: "2025-05-20",
      },
      {
        id: 4,
        name: "E-commerce Platform",
        status: "Pending",
        deadline: "2025-07-10",
      },
      {
        id: 5,
        name: "Marketing Campaign",
        status: "Completed",
        deadline: "2024-11-20",
      },
      {
        id: 6,
        name: "AI Chatbot Integration",
        status: "In Progress",
        deadline: "2025-06-30",
      },
      {
        id: 7,
        name: "Cybersecurity Audit",
        status: "Pending",
        deadline: "2025-09-15",
      },
      {
        id: 8,
        name: "New Feature Rollout",
        status: "In Progress",
        deadline: "2025-04-05",
      },
      {
        id: 9,
        name: "Customer Support Portal",
        status: "Completed",
        deadline: "2024-10-15",
      },
      {
        id: 10,
        name: "Data Analytics Dashboard",
        status: "Pending",
        deadline: "2025-08-01",
      },
    ];
    setAvailableProjects(mockProjects);
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = availableProjects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects([]);
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

  const shouldShowProjects = searchTerm.trim().length > 0;

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
                <div key={project.id} className={styles.projectCard}>
                  <label className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      checked={formData.projects.includes(
                        project.id.toString()
                      )}
                      onChange={() =>
                        handleCheckboxChange(project.id.toString())
                      }
                    />
                    <div className={styles.projectCardContent}>
                      <span className={styles.projectName}>{project.name}</span>
                      <span
                        className={`${styles.projectStatus} ${
                          styles[
                            `status-${project.status
                              .toLowerCase()
                              .replace(/\s+/g, "")}`
                          ]
                        }`}
                      >
                        {project.status}
                      </span>
                      <span className={styles.projectDeadline}>
                        Due: {project.deadline}
                      </span>
                    </div>
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
                (p) => p.id.toString() === projectId
              );
              return project ? (
                <li key={projectId}>
                  <span className={styles.selectedProjectName}>
                    {project.name}
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
