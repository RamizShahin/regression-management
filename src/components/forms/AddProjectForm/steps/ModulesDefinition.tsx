import React, { useState } from "react";
import { ProjectFormData, ModuleData } from "../validationSchema";

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
      const updatedModules = [...formData.modules];
      updatedModules[editIndex] = {
        ...updatedModules[editIndex],
        name: moduleName,
        description: moduleDescription,
      };
      onModulesChange(updatedModules);
    } else {
      onModulesChange([...formData.modules, newModule]);
    }

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
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">Add Modules</h2>

      {/* Inputs Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1 flex gap-1 items-center">
            📦 Module Name
          </label>
          <input
            type="text"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            placeholder="Enter module name..."
            className="w-full rounded-md bg-gray-800 text-white px-3 py-2 text-sm border border-gray-600 focus:outline-none focus:ring focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1 flex gap-1 items-center">
            📋 Description
          </label>
          <textarea
            value={moduleDescription}
            onChange={(e) => setModuleDescription(e.target.value)}
            placeholder="Describe the module..."
            rows={3}
            className="w-full rounded-md bg-gray-800 text-white px-3 py-2 text-sm border border-gray-600 focus:outline-none focus:ring focus:ring-purple-500"
          />
        </div>

        {/* Button Centered */}
        <div className="flex justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleAddModule}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-md"
          >
            {editIndex !== null ? "Update Module" : "Add Module"}
          </button>
          {editIndex !== null && (
            <button
              type="button"
              onClick={() => {
                setModuleName("");
                setModuleDescription("");
                setEditIndex(null);
              }}
              className="text-sm text-gray-300 hover:underline"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold text-white">Defined Modules</h3>
        {formData.modules.length === 0 ? (
          <div className="text-sm text-gray-400">
            No modules defined yet. Add your first module above.
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-4 pr-1">
            {formData.modules.map((module, index) => (
              <div
                key={module.id}
                className="bg-gray-800 rounded-md p-4 border border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div>
                  <p className="text-white font-medium">{module.name}</p>
                  <p className="text-sm text-gray-400">{module.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {module.components.length} component(s)
                  </p>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => handleEditModule(index)}
                    className="text-blue-400 text-sm hover:underline"
                    title="Edit"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteModule(index)}
                    className="text-red-400 text-sm hover:underline"
                    title="Delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {errors.modules && (
        <p className="text-sm text-red-500">{errors.modules}</p>
      )}
    </div>
  );
};

export default ModulesDefinition;
