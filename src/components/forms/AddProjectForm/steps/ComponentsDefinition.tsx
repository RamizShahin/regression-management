import React, { useState } from "react";
import {
  ProjectFormData,
  ModuleData,
  ComponentData,
} from "../validationSchema";

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
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(null);
  const [componentName, setComponentName] = useState("");
  const [componentDescription, setComponentDescription] = useState("");
  const [editComponentIndex, setEditComponentIndex] = useState<number | null>(null);

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
    const currentComponents = [...(updatedModules[selectedModuleIndex].components || [])];

    if (editComponentIndex !== null) {
      currentComponents[editComponentIndex] = {
        ...currentComponents[editComponentIndex],
        name: componentName,
        description: componentDescription,
      };
    } else {
      currentComponents.push(newComponent);
    }

    updatedModules[selectedModuleIndex].components = currentComponents;
    onModulesChange(updatedModules);

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
    const currentComponents = [...(updatedModules[selectedModuleIndex].components || [])];

    currentComponents.splice(index, 1);
    updatedModules[selectedModuleIndex].components = currentComponents;

    onModulesChange(updatedModules);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Define Components</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Select a Module
        </label>
        <select
          className="w-full rounded-md bg-gray-800 text-white border border-gray-600 px-3 py-2"
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
          <div className="bg-gray-800 rounded-md p-4 space-y-4 border border-gray-700">
            <h3 className="text-lg font-medium text-white">Add Component to "{selectedModule.name}"</h3>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Component Name</label>
              <input
                type="text"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                className="w-full rounded-md bg-gray-900 text-white border border-gray-700 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Description</label>
              <textarea
                value={componentDescription}
                onChange={(e) => setComponentDescription(e.target.value)}
                rows={3}
                className="w-full rounded-md bg-gray-900 text-white border border-gray-700 px-3 py-2"
              />
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleAddComponent}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                {editComponentIndex !== null ? "Update Component" : "Add Component"}
              </button>
              {editComponentIndex !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setComponentName("");
                    setComponentDescription("");
                    setEditComponentIndex(null);
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">Components in "{selectedModule.name}"</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {selectedModule.components.length === 0 ? (
                <p className="text-sm text-gray-400">No components yet.</p>
              ) : (
                selectedModule.components.map((component, index) => (
                  <div
                    key={component.id}
                    className="bg-gray-800 rounded-md p-4 border border-gray-700 text-white flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{component.name}</p>
                      {component.description && (
                        <p className="text-sm text-gray-400">{component.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditComponent(index)}
                        className="text-blue-400 hover:underline text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComponent(index)}
                        className="text-red-400 hover:underline text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {!selectedModule && (
        <div className="text-sm text-gray-400">
          Please select a module to define components.
        </div>
      )}

      {formData.modules.length === 0 && (
        <div className="text-sm text-red-400">
          No modules have been created yet. Please go back to the previous step.
        </div>
      )}
    </div>
  );
};

export default ComponentsDefinition;
