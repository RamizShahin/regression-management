import React, { useState } from "react";
import { ProjectFormData, ModuleData } from "../validationSchema";
import styles from "../AddProjectForm.module.css";

type ModulesDefinitionProps = {
  formData: ProjectFormData;
  onModulesChange: (modules: ModuleData[]) => void;
  errors: Record<string, string>;
};

const ModulesDefinition: React.FC<ModulesDefinitionProps> = ({
  formData,
  onModulesChange,
  errors,
}) => {
  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddModule = () => {
    if (!moduleName.trim()) return;

    const newModule: ModuleData = {
      id: Date.now().toString(),
      name: moduleName,
      description: moduleDescription,
      components: [],
    };

    if (editIndex !== null) {
      // Update existing module
      const updatedModules = [...formData.modules];
      updatedModules[editIndex] = {
        ...updatedModules[editIndex],
        name: moduleName,
        description: moduleDescription,
      };
      onModulesChange(updatedModules);
    } else {
      // Add new module
      onModulesChange([...formData.modules, newModule]);
    }

    // Reset form
    setModuleName("");
    setModuleDescription("");
    setEditIndex(null);
  };

  const handleEditModule = (index: number) => {
    const module = formData.modules[index];
    setModuleName(module.name);
    setModuleDescription(module.description || "");
    setEditIndex(index);
  };

  const handleDeleteModule = (index: number) => {
    const updatedModules = [...formData.modules];
    updatedModules.splice(index, 1);
    onModulesChange(updatedModules);
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.formSection}>
        <h3>Add Modules</h3>

        <div className={styles.moduleForm}>
          <div className={styles.formGroup}>
            <label htmlFor="moduleName">
              <span className={styles.labelIcon}>📦</span>
              Module Name
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                id="moduleName"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                placeholder="Enter module name..."
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="moduleDescription">
              <span className={styles.labelIcon}>📋</span>
              Description
            </label>
            <div className={styles.inputWrapper}>
              <textarea
                id="moduleDescription"
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
                placeholder="Describe the module..."
              />
            </div>
          </div>

          <div className={styles.moduleActions}>
            <button
              type="button"
              className={styles.moduleButton}
              onClick={handleAddModule}
            >
              {editIndex !== null ? "Update Module" : "Add Module"}
            </button>
            {editIndex !== null && (
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => {
                  setModuleName("");
                  setModuleDescription("");
                  setEditIndex(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className={styles.moduleList}>
          <h3>Defined Modules</h3>
          {formData.modules.length === 0 ? (
            <div className={styles.emptyState}>
              No modules defined yet. Add your first module above.
            </div>
          ) : (
            <div className={styles.moduleGrid}>
              {formData.modules.map((module, index) => (
                <div key={module.id} className={styles.moduleCard}>
                  <div className={styles.moduleHeader}>
                    <p className={styles.moduleDescription}>{module.name}</p>
                    <div className={styles.moduleActions}>
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => handleEditModule(index)}
                        title="Edit module"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => handleDeleteModule(index)}
                        title="Delete module"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className={styles.componentCount}>
                    {module.components.length} component(s)
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {errors.modules && <div className={styles.error}>{errors.modules}</div>}
      </div>
    </div>
  );
};

export default ModulesDefinition;
