import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import InfoBox from "../../components/InfoBox";
import RadialChart from "../../components/RadialChart";
import Table, { type Column } from "../../components/Table";
import TextArea from "../../components/TextArea";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import authService from "../../services/auth";

type TestRow = {
  name: string;
  dateOfRun: string;
  runBy: string;
  status: string;
};

export default function ProjectComponent() {
  const { id: rawProjectId, regressionId, moduleId, componentId } = useParams<{
    id: string;
    regressionId: string;
    moduleId: string;
    componentId: string;
  }>();
  const projectId = rawProjectId?.trim();
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

  const columns: Column<TestRow>[] = [
    { key: "name", header: "Test Name", accessor: "name" },
    { key: "dateOfRun", header: "Date of Run", accessor: "dateOfRun" },
    { key: "runBy", header: "Run By", accessor: "runBy" },
    { key: "status", header: "Status", accessor: "status" },
  ];

  const data: TestRow[] = [
    { name: "Test 1", dateOfRun: "2025-05-20", runBy: "Alice", status: "Passed" },
    { name: "Test 2", dateOfRun: "2025-05-18", runBy: "Bob", status: "Failed" },
    { name: "Test 3", dateOfRun: "2025-05-15", runBy: "Charlie", status: "Passed" },
    { name: "Test 4", dateOfRun: "2025-05-10", runBy: "Dana", status: "Skipped" },
    { name: "Test 5", dateOfRun: "2025-05-10", runBy: "Dana", status: "Skipped" },
    { name: "Test 6", dateOfRun: "2025-05-10", runBy: "Dana", status: "Skipped" },
    { name: "Test 7", dateOfRun: "2025-05-10", runBy: "Dana", status: "Skipped" },
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
                <Link to={`/projects/${projectId}`} className="text-sm font-medium text-gray-400 hover:text-gray-200">
                  {projectName}
                </Link>
              </div>
            </li>

            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="size-5 shrink-0 text-gray-500" />
                <Link to={`/projects/${projectId}/regression/${regressionId}`} className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-200">
                  Regression #{regressionId}
                </Link>
              </div>
            </li>

            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="size-5 shrink-0 text-gray-500" />
                <Link to={`/projects/${projectId}/regression/${regressionId}/module/${moduleId}`} className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-200">
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
              { label: "Name", value: "Login API Test" },
              { label: "Component", value: "Backend API" },
              { label: "Regression Run", value: "2025-03-15 10:32" },
              { label: "Executed By", value: "Alice Johnson" },
              { label: "Status", value: "Failed" },
            ]}
            buttonText="Rerun Component"
            onButtonClick={() => alert("Running Component...")}
          />
        </div>
        <div className="w-full lg:w-3/5">
          <TextArea
            title="Error Message"
            content={`{\n"error": "Invalid credentials. Expected 200 OK but received 401 Unauthorized."\n}`}
          />
        </div>
      </div>

      <div className="m-auto flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3">
          <div className="m-auto p-6 rounded-2xl bg-gray-900 lg:h-full">
            <h2 className="text-lg font-semibold text-white mb-4">Test History & Previous Runs</h2>
            <Table
              columns={columns}
              data={data.slice((currentPage - 1) * 6, currentPage * 6)}
              currentPage={currentPage}
              totalItems={data.length}
              pageSize={6}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <RadialChart
            title="Test's History & Previous Runs"
            series={[50, 40, 10]}
            labels={["Passed", "Failed", "Unknown"]}
          />
        </div>
      </div>

      <div className="m-auto mt-6">
        <TextArea
          title="Log File"
          content={`2025-03-15 10:32:00 [INFO] User login attempt started
2025-03-15 10:32:05 [INFO] Request received: POST /login
2025-03-15 10:32:05 [INFO] Request data: {"username": "john_doe", "password": "password123"}
2025-03-15 10:32:06 [DEBUG] Request headers: {"Content-Type": "application/json", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
2025-03-15 10:32:06 [DEBUG] Validating credentials for user john_doe
2025-03-15 10:32:06 [ERROR] Invalid credentials. Expected 200 OK but received 401 Unauthorized.
2025-03-15 10:32:06 [ERROR] Failed login attempt for user john_doe
2025-03-15 10:32:06 [INFO] Request URL: /login
2025-03-15 10:32:06 [INFO] Status Code: 401
2025-03-15 10:32:06 [INFO] Expected Code: 200
2025-03-15 10:32:06 [INFO] User IP: 192.168.1.10
2025-03-15 10:32:06 [INFO] User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
2025-03-15 10:32:06 [INFO] Session ID: abc123456789
2025-03-15 10:32:07 [INFO] Checking lockout policy for user john_doe
2025-03-15 10:32:07 [INFO] Lockout policy: No action triggered
2025-03-15 10:32:07 [DEBUG] Logging failed login event for john_doe
2025-03-15 10:32:07 [INFO] Failed login event logged
2025-03-15 10:32:08 [INFO] Redirecting user john_doe to /login
2025-03-15 10:32:08 [INFO] User john_doe redirected to /login
2025-03-15 10:32:12 [INFO] User login attempt started
2025-03-15 10:32:15 [INFO] Request received: POST /login
2025-03-15 10:32:16 [ERROR] Invalid credentials. Expected 200 OK but received 401 Unauthorized.
2025-03-15 10:32:16 [ERROR] Failed login attempt for user john_doe
2025-03-15 10:32:16 [INFO] Request URL: /login`}
        />
      </div>
    </div>
  );
}
