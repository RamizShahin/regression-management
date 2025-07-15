import React, { useState, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authService from "../../../services/auth";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const NewRegressionRun: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [plugin, setPlugin] = useState<string>("");
  const [logFiles, setLogFiles] = useState<File[]>([]);
  const [regressionName, setRegressionName] = useState<string>("");
  const [runDate, setRunDate] = useState<string>("");

  const handleFolderChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setLogFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("regressionName", regressionName);
    formData.append("plugin", plugin);
    formData.append("runDate", runDate);
    formData.append("projectId", id ?? "");

    logFiles.forEach((file) => {
      formData.append("logs", file);
    });

    try {
      const response = await authService.makeAuthenticatedRequest(
        "/api/upload-regression",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      console.log("Upload result:", result);
      if (response.status == 200) {
        alert("Parsing started successfully");
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 sm:p-10">
      <div className="max-w-4xl mx-auto bg-gray-900 p-6 sm:p-10 rounded-lg shadow-md">
        <button
          onClick={() => navigate(`/projects/${id}`)}
          className="mb-6 inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Go Back
        </button>

        <h1 className="text-2xl font-bold mb-6 text-white">
          Add New Regression Run
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="regressionName"
              className="block mb-1 text-gray-300"
            >
              Regression Name
            </label>
            <input
              type="text"
              id="regressionName"
              value={regressionName}
              onChange={(e) => setRegressionName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="plugin" className="block mb-1 text-gray-300">
              Select Plugin
            </label>
            <select
              id="plugin"
              value={plugin}
              onChange={(e) => setPlugin(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose a Plugin --</option>
              <option value="plugin1">Plugin 1</option>
              <option value="plugin2">Plugin 2</option>
              <option value="plugin3">Plugin 3</option>
            </select>
          </div>

          <div>
            <label htmlFor="runDate" className="block mb-1 text-gray-300">
              Run Date
            </label>
            <input
              type="date"
              id="runDate"
              value={runDate}
              onChange={(e) => setRunDate(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="uploadLogFolder"
              className="block mb-1 text-gray-300"
            >
              Upload Log Folder
            </label>
            {/* @ts-ignore */}
            <input
              type="file"
              id="uploadLogFolder"
              multiple
              // @ts-ignore
              webkitdirectory="true"
              onChange={handleFolderChange}
              required
              className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-md transition"
          >
            Start Parsing
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRegressionRun;
