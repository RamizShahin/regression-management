import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import InfoBox from "../../components/InfoBox";
import RadialChart from "../../components/RadialChart";
import Table from "../../components/Table";
import TextArea from "../../components/TextArea";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import authService from "../../services/auth";

export default function ProjectComponent() {
  const {
    id: rawProjectId,
    regressionId,
    moduleId,
    componentId,
  } = useParams<{
    id: string;
    regressionId: string;
    moduleId: string;
    componentId: string;
  }>();
  const projectId = rawProjectId?.trim();
  const [projectName, setProjectName] = useState("Loading...");
  const [currentPage, setCurrentPage] = useState(1);
  const [component, setComponent] = useState<any>("");
  const [errors, setErrors] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [logs, setLogs] = useState<string>("");

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setProjectName("Unknown Project");
        return;
      }

      try {
        const response = await authService.makeAuthenticatedRequest(
          `/api/projects/${projectId}`
        );
        if (!response.ok) throw new Error("Failed to fetch project");
        const data = await response.json();
        setProjectName(data.project_name || "Project");
      } catch (err) {
        setProjectName("Project");
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const fetchComponent = async () => {
      try {
        const response = await authService.makeAuthenticatedRequest(
          `/api/regression/${regressionId}/module/${moduleId}/component/${componentId}`
        );
        const data = await response.json();

        const date = new Date(data.execution_date);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        data.execution_date = formattedDate;

        setComponent(data);
      } catch (err) {
        setComponent("");
      }
    };

    const fetchErrors = async () => {
      try {
        const response = await authService.makeAuthenticatedRequest(
          `/api/regression/${regressionId}/module/${moduleId}/component/${componentId}/errors`
        );
        const errors = await response.json();

        setErrors(errors);
      } catch (err) {
        setErrors([]);
      }
    };

    const fetchHistory = async () => {
      try {
        const response = await authService.makeAuthenticatedRequest(
          `/api/regression/${regressionId}/module/${moduleId}/component/${componentId}/history`
        );
        const history = await response.json();

        const cleanedData = history.map((row: any) => {
          const date = new Date(row.execution_date);
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, "0");
          const dd = String(date.getDate()).padStart(2, "0");
          const formattedDate = `${yyyy}-${mm}-${dd}`;

          return {
            ...row,
            execution_date: formattedDate,
          };
        });

        setHistory(cleanedData);
      } catch (err) {
        setHistory([]);
      }
    };

    fetchComponent();
    fetchErrors();
    fetchHistory();
  }, [componentId]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!component.component_name) return;

      try {
        const response = await authService.makeAuthenticatedRequest(
          `/api/regression/${regressionId}/module/${moduleId}/component/${componentId}/logs?name=${encodeURIComponent(
            component.component_name
          )}`
        );

        const logText = await response.text();
        setLogs(logText);
      } catch (err) {
        setLogs("Failed to load logs.");
      }
    };

    fetchLogs();
  }, [component.component_name]);

  const historyHeaderMap: Record<string, string> = {
    test_name: "Test Name",
    execution_date: "Date Of Run",
    name: "Run By",
    status: "Status",
  };

  const historyColumns = useMemo(() => {
    if (history.length === 0) return [];

    const dynamicColumns = Object.keys(history[0]).map((key) => ({
      key,
      header: historyHeaderMap[key],
      accessor: key,
    }));

    return dynamicColumns;
  }, [history]);

  const outcomeTotals = [
    history.reduce((sum, r) => sum + (r.status == "PASS" ? 1 : 0 || 0), 0),
    history.reduce((sum, r) => sum + (r.status == "FAIL" ? 1 : 0 || 0), 0),
    history.reduce((sum, r) => sum + (r.status == "UNKNOWN" ? 1 : 0 || 0), 0),
  ];

  return (
    <div className="p-6">
      <div className="mb-7">
        {/* Mobile Back */}
        <nav aria-label="Back" className="sm:hidden">
          <Link
            to={`/projects/${projectId}/regression/${regressionId}/module/${moduleId}`}
            className="flex items-center text-sm font-medium text-gray-400 hover:text-gray-200"
          >
            <ChevronLeftIcon className="mr-1 -ml-1 size-5 shrink-0 text-gray-500" />
            Back
          </Link>
        </nav>

        {/* Desktop Breadcrumb */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div className="flex">
                <Link
                  to={`/projects/${projectId}`}
                  className="text-sm font-medium text-gray-400 hover:text-gray-200"
                >
                  {projectName}
                </Link>
              </div>
            </li>

            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="size-5 shrink-0 text-gray-500" />
                <Link
                  to={`/projects/${projectId}/regression/${regressionId}`}
                  className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-200"
                >
                  Regression #{regressionId}
                </Link>
              </div>
            </li>

            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="size-5 shrink-0 text-gray-500" />
                <Link
                  to={`/projects/${projectId}/regression/${regressionId}/module/${moduleId}`}
                  className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-200"
                >
                  Module #{moduleId}
                </Link>
              </div>
            </li>

            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="size-5 shrink-0 text-gray-500" />
                <span className="ml-4 text-sm font-medium text-gray-400">
                  Component #{componentId}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="m-auto mb-5 flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/5">
          <InfoBox
            title="Component Information"
            rows={[
              { label: "Name", value: component.test_name },
              { label: "Component", value: component.component_name },
              { label: "Regression Run", value: component.execution_date },
              { label: "Executed By", value: component.name },
              { label: "Status", value: component.status },
            ]}
            buttonText="Rerun Component"
            onButtonClick={() => alert("Running Component...")}
          />
        </div>
        <div className="w-full lg:w-3/5">
          <TextArea
            title="Error Message"
            content={
              errors && errors.length > 0
                ? errors.map((e) => `• ${e.error_message}`).join("\n")
                : "No Errors!"
            }
          />
        </div>
      </div>

      <div className="m-auto flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3">
          <div className="m-auto p-6 rounded-2xl bg-gray-900 lg:h-full">
            <h2 className="text-lg font-semibold text-white mb-4">
              Test History & Previous Runs
            </h2>
            <Table
              columns={historyColumns}
              data={history.slice((currentPage - 1) * 5, currentPage * 5)}
              currentPage={currentPage}
              totalItems={history.length}
              pageSize={5}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          {history.length > 0 ? (
            <RadialChart
              title="Test's History & Previous Runs"
              series={outcomeTotals}
              labels={["Passed", "Failed", "Unknown"]}
            />
          ) : (
            <div className="text-gray-400">Loading chart data...</div>
          )}
        </div>
      </div>

      <div className="m-auto mt-6">
        <TextArea title="Log File" content={logs ? logs : "No Data Found!"} />
      </div>
    </div>
  );
}
