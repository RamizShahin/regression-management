import React, { useState, ChangeEvent, FormEvent } from "react";
import styles from "./newregression.module.css";
import { useParams } from "react-router-dom";
import authService from "../../../services/auth";

const NewRegressionRun: React.FC = () => {
  const { id } = useParams<{ id: string }>();

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
    console.log({ plugin, logFiles, regressionName, runDate, id });

    const formData = new FormData();
    formData.append("regressionName", regressionName);
    formData.append("plugin", plugin);
    formData.append("runDate", runDate);
    formData.append("projectId", id ?? "");

    logFiles.forEach((file, idx) => {
      formData.append("logs", file); // 'logs' will be your backend field name
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
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className={styles["new-regression-container"]}>
      <h1>Add New Regression Run</h1>
      <form className={styles["regression-form"]} onSubmit={handleSubmit}>
        <div className={styles["form-row"]}>
          <label htmlFor="regressionName">Regression Name:</label>
          <input
            type="text"
            id="regressionName"
            value={regressionName}
            onChange={(e) => setRegressionName(e.target.value)}
            required
          />
        </div>

        <div className={styles["form-row"]}>
          <label htmlFor="plugin">Select Plugin:</label>
          <select
            id="plugin"
            value={plugin}
            onChange={(e) => setPlugin(e.target.value)}
            required
          >
            <option value="">-- Choose a Plugin --</option>
            <option value="plugin1">Plugin 1</option>
            <option value="plugin2">Plugin 2</option>
            <option value="plugin3">Plugin 3</option>
          </select>
        </div>

        <div className={styles["form-row"]}>
          <label htmlFor="runDate">Run Date:</label>
          <input
            type="date"
            id="runDate"
            value={runDate}
            onChange={(e) => setRunDate(e.target.value)}
            required
          />
        </div>

        <div className={styles["form-row"]}>
          <label htmlFor="uploadLogFolder">Upload Log Folder:</label>
          {/* @ts-ignore */}
          <input
            type="file"
            id="uploadLogFolder"
            multiple
            // @ts-ignore
            webkitdirectory="true"
            onChange={handleFolderChange}
            required
          />
        </div>

        <button type="submit">Start Parsing</button>
      </form>
    </div>
  );
};

export default NewRegressionRun;
