import React, { useState } from "react";
import {
  ProjectFormData,
  ModuleData,
  ComponentData,
} from "../validationSchema";
import styles from "../AddProjectForm.module.css";

type ComponentsDefinitionProps = {
  formData: ProjectFormData;
  onModulesChange: (modules: ModuleData[]) => void;
  errors: Record<string, string>;
};

const ComponentsDefinition: React.FC<ComponentsDefinitionProps> = ({
  formData,
  onModulesChange,
  errors,
}) => {
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(
    null
  );
  const [componentName, setComponentName] = useState("");
  const [componentDescription, setComponentDescription] = useState("");
  const [editComponentIndex, setEditComponentIndex] = useState<number | null>(
    null
  );

  const selectedModule =
    selectedModuleIndex !== null ? formData.modules[selectedModuleIndex] : null;

  const handleAddComponent = () => {
    if (!componentName.trim() || selectedModuleIndex === null) return;

    const newComponent: ComponentData = {
      id: Date.now().toString(),
      name: componentName,
      description: componentDescription,
    };

    const updatedModules = [...formData.modules];
    const currentComponents = [
      ...(updatedModules[selectedModuleIndex].components || []),
    ];

    if (editComponentIndex !== null) {
      // Update existing component
      currentComponents[editComponentIndex] = {
        ...currentComponents[editComponentIndex],
        name: componentName,
        description: componentDescription,
      };
    } else {
      // Add new component
      currentComponents.push(newComponent);
    }

    updatedModules[selectedModuleIndex].components = currentComponents;
    onModulesChange(updatedModules);

    // Reset form
    setComponentName("");
    setComponentDescription("");
    setEditComponentIndex(null);
  };

  const handleEditComponent = (index: number) => {
    if (selectedModuleIndex === null) return;

    const component = formData.modules[selectedModuleIndex].components[index];
    setComponentName(component.name);
    setComponentDescription(component.description || "");
    setEditComponentIndex(index);
  };

  const handleDeleteComponent = (index: number) => {
    if (selectedModuleIndex === null) return;

    const updatedModules = [...formData.modules];
    const currentComponents = [
      ...(updatedModules[selectedModuleIndex].components || []),
    ];

    currentComponents.splice(index, 1);
    updatedModules[selectedModuleIndex].components = currentComponents;

    onModulesChange(updatedModules);
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.formSection}>
        <h3>Define Components</h3>

        <div className={styles.moduleSelection}>
          <label htmlFor="moduleSelector" className={styles.sectionLabel}>
            Select a Module:
          </label>
          <select
            id="moduleSelector"
            className={styles.moduleSelector}
            value={selectedModuleIndex !== null ? selectedModuleIndex : ""}
            onChange={(e) => {
              const index = e.target.value ? parseInt(e.target.value) : null;
              setSelectedModuleIndex(index);
              setComponentName("");
              setComponentDescription("");
              setEditComponentIndex(null);
            }}
          >
            <option value="">-- Select a module --</option>
            {formData.modules.map((module, index) => (
              <option key={module.id} value={index}>
                {module.name}
              </option>
            ))}
          </select>
        </div>

        {selectedModule && (
          <>
            <div className={styles.componentForm}>
              <h4>Add Component to "{selectedModule.name}"</h4>
              <div className={styles.formGroup}>
                <label htmlFor="componentName">
                  <span className={styles.labelIcon}>🧩</span>
                  Component Name
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="componentName"
                    value={componentName}
                    onChange={(e) => setComponentName(e.target.value)}
                    placeholder="Enter component name..."
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="componentDescription">
                  <span className={styles.labelIcon}>📋</span>
                  Description
                </label>
                <div className={styles.inputWrapper}>
                  <textarea
                    id="componentDescription"
                    value={componentDescription}
                    onChange={(e) => setComponentDescription(e.target.value)}
                    placeholder="Describe the component..."
                  />
                </div>
              </div>

              <div className={styles.moduleActions}>
                <button
                  type="button"
                  className={styles.moduleButton}
                  onClick={handleAddComponent}
                >
                  {editComponentIndex !== null
                    ? "Update Component"
                    : "Add Component"}
                </button>
                {editComponentIndex !== null && (
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setComponentName("");
                      setComponentDescription("");
                      setEditComponentIndex(null);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className={styles.componentList}>
              <h4>Components in "{selectedModule.name}"</h4>
              {selectedModule.components.length === 0 ? (
                <div className={styles.emptyState}>
                  No components defined yet. Add your first component above.
                </div>
              ) : (
                <div className={styles.componentGrid}>
                  {selectedModule.components.map((component, index) => (
                    <div key={component.id} className={styles.componentCard}>
                      <div className={styles.componentHeader}>
                        <p className={styles.componentName}>{component.name}</p>
                        <div className={styles.componentActions}>
                          <button
                            type="button"
                            className={styles.iconButton}
                            onClick={() => handleEditComponent(index)}
                            title="Edit component"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className={styles.iconButton}
                            onClick={() => handleDeleteComponent(index)}
                            title="Delete component"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      {component.description && (
                        <p className={styles.componentDescription}>
                          {component.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {!selectedModule && (
          <div className={styles.moduleSelectMessage}>
            Please select a module from the dropdown to define components.
          </div>
        )}

        {formData.modules.length === 0 && (
          <div className={styles.noModulesMessage}>
            No modules have been created yet. Please go back to the previous
            step and create at least one module.
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentsDefinition;
