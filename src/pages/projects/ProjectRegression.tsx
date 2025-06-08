import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LineChart from "../../components/LineChart";
import InfoBox from "../../components/InfoBox";
import RadialChart from "../../components/RadialChart";
import Table, { type Column } from "../../components/TableWithPaging";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import authService from "../../services/auth";

type ModuleRow = {
  id: number;
  name: string;
  componentCount: number;
  makeDate: string;
  lastRegressionDate: string;
};

type TestCaseRow = {
  name: string;
  moduleName: string;
  error: string;
};

export default function ProjectRegression() {
  const { id: rawProjectId, regressionId } = useParams<{ id: string; regressionId: string }>();
  const projectId = rawProjectId?.trim();
  console.warn("project id = ", projectId);
  const [projectName, setProjectName] = useState("Loading...");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setProjectName("Unknown Project");
        return;
      }

      try {
        const response = await authService.makeAuthenticatedRequest(`/api/projects/${projectId}`);
        if (!response.ok) throw new Error("Failed to fetch project");
        const data = await response.json();
        setProjectName(data.project_name || "Project");
      } catch (err) {
        setProjectName("Project");
      }
    };

    fetchProject();
  }, [projectId]);

  const moduleColumns: Column<ModuleRow>[] = [
    { key: "name", header: "Module Name", accessor: "name" },
    { key: "componentCount", header: "Components", accessor: "componentCount" },
    { key: "makeDate", header: "Created On", accessor: "makeDate" },
    { key: "lastRegressionDate", header: "Last Regression", accessor: "lastRegressionDate" },
  ];

  const moduleData: ModuleRow[] = [
    { id: 1, name: "Auth Module", componentCount: 5, makeDate: "2025-03-01", lastRegressionDate: "2025-06-04" },
    { id: 2, name: "Reporting Module", componentCount: 8, makeDate: "2025-02-15", lastRegressionDate: "2025-05-28" },
    { id: 3, name: "Logging Module", componentCount: 3, makeDate: "2025-01-20", lastRegressionDate: "2025-04-30" },
  ];

  const testCaseColumns: Column<TestCaseRow>[] = [
    { key: "name", header: "Test Name", accessor: "name" },
    { key: "moduleName", header: "Module", accessor: "moduleName" },
    { key: "error", header: "Error", accessor: "error" },
  ];

  const testCaseData: TestCaseRow[] = [
    { name: "LoginTest", moduleName: "Login", error: "Failed" },
    { name: "LogoutTest", moduleName: "DB", error: "Unknown" },
    { name: "ReportExportTest", moduleName: "DB", error: "Failed" },
    { name: "LogCleanupTest", moduleName: "Clean up", error: "Unknown" },
  ];

  const series = [
    { name: "Passed", data: [10, 15, 20, 25, 30, 5, 10, 15, 20, 25] },
    { name: "Failed", data: [5, 10, 15, 20, 25, 2, 7, 12, 17, 22] },
    { name: "Unknown", data: [2, 7, 12, 17, 22, 10, 15, 20, 25, 30] },
  ];

  const categories = [
    "#1", "#2", "#3", "#4", "#5",
    "#6", "#7", "#8", "#9", "#10",
  ];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-7">
        <nav aria-label="Back" className="sm:hidden">
          <Link to={`/projects/${projectId}`} className="flex items-center text-sm font-medium text-gray-400 hover:text-gray-200">
            <ChevronLeftIcon className="mr-1 -ml-1 size-5 shrink-0 text-gray-500" />
            Back
          </Link>
        </nav>

        <nav aria-label="Breadcrumb" className="hidden sm:flex">
          <ol className="flex items-center space-x-4">
            <li>
              <div className="flex">
                <Link to={`/projects/${projectId}`} className="text-sm font-medium text-gray-400 hover:text-gray-200">
                  {projectName}
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="size-5 shrink-0 text-gray-500" />
                <span className="ml-4 text-sm font-medium text-gray-400">
                  Regression #{regressionId}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Info & Charts */}
      <div className="m-auto mb-5 flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/3">
          <InfoBox
            title="Regression Info"
            rows={[
              { label: "Name", value: `Full Regression ${regressionId}` },
              { label: "Execution Date", value: "2025-03-15 10:32" },
              { label: "Status", value: "In Progress" },
            ]}
            buttonText="Run Regression Modules"
            onButtonClick={() => alert("Running Modules...")}
          />
        </div>

        <div className="w-full lg:w-2/3">
          <LineChart
            title="Regression Modules’ Outputs"
            series={series}
            categories={categories}
            onDateChange={(from, to) => console.log(`Changed: ${from} to ${to}`)}
            defaultFromDate="2025-05-20"
            defaultToDate="2025-05-27"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="m-auto flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3 flex flex-col">
          <div className="rounded-2xl shadow-md bg-gray-900 p-6 flex-grow">
            <h2 className="text-lg font-semibold text-white mb-4">Failed/Unknown Test Cases</h2>
            <Table
              columns={testCaseColumns}
              data={testCaseData.slice((currentPage - 1) * 5, currentPage * 5)}
              currentPage={currentPage}
              totalItems={testCaseData.length}
              pageSize={5}
              onPageChange={setCurrentPage}
              getEditLink={() => ""}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <RadialChart
            title="Regression Task Status"
            series={[50, 40, 10]}
            labels={["Succeeded", "Failed", "Unknown"]}
          />
        </div>
      </div>


      {/* Modules Table */}
      <div className="m-auto mt-6 rounded-2xl shadow-md bg-gray-900 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Modules</h2>
        <Table
          columns={moduleColumns}
          data={moduleData.slice((currentPage - 1) * 5, currentPage * 5)}
          currentPage={currentPage}
          totalItems={moduleData.length}
          pageSize={5}
          onPageChange={setCurrentPage}
          onEdit={(item) => alert(`Edit module: ${item.name}`)}
          onDelete={(item) => alert(`Delete module: ${item.name}`)}
          getEditLink={(item) => `/projects/${projectId}/regression/${regressionId}/module/${item.id}`}
        />
      </div>
    </div>
  );
}
