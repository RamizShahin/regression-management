import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import InfoBox from "../../components/InfoBox";
import RadialChart from "../../components/RadialChart";
import PieChart from "../../components/PieChart";
import Table, { type Column } from "../../components/TableWithPaging";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import authService from "../../services/auth";

type ComponentRow = { 
  id: number;
  name: string;
  owner: string;
  lastRunDate: string;
};

type TestCaseRow = {
  name: string;
  error: string;
};

export default function ProjectModule() {
    const { id: rawProjectId, regressionId, moduleId } = useParams<{
        id: string;
        regressionId: string;
        moduleId: string;
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

    const componentColumns: Column<ComponentRow>[] = [
        { key: "name", header: "Component Name", accessor: "name" },
        { key: "owner", header: "Owner", accessor: "owner" },
        { key: "lastRunDate", header: "Last Run", accessor: "lastRunDate" },
    ];

    const componentData: ComponentRow[] = [
        { id: 1, name: "Login API", owner: "Alice Johnson", lastRunDate: "2025-06-01" },
        { id: 2, name: "Export Report", owner: "Bob Smith", lastRunDate: "2025-05-30" },
        { id: 3, name: "Log Rotation", owner: "Charlie Brown", lastRunDate: "2025-05-25" },
    ];

    const testCaseColumns: Column<TestCaseRow>[] = [
        { key: "name", header: "Test Name", accessor: "name" },
        { key: "error", header: "Error", accessor: "error" },
      ];
    
      const testCaseData: TestCaseRow[] = [
        { name: "LoginTest", error: "Failed" },
        { name: "LogoutTest", error: "Unknown" },
        { name: "ReportExportTest", error: "Failed" },
        { name: "LogCleanupTest", error: "Unknown" },
        { name: "ReportExportTest", error: "Failed" },
        { name: "LogCleanupTest", error: "Unknown" },
      ];

    return (
        <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-7">
            <nav aria-label="Back" className="sm:hidden">
            <Link
                to={`/projects/${projectId}/regression/${regressionId}`}
                className="flex items-center text-sm font-medium text-gray-400 hover:text-gray-200"
            >
                <ChevronLeftIcon className="mr-1 -ml-1 size-5 shrink-0 text-gray-500" />
                Back
            </Link>
            </nav>

            <nav aria-label="Breadcrumb" className="hidden sm:flex">
            <ol className="flex items-center space-x-4">
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
                        <span className="ml-4 text-sm font-medium text-gray-400">
                        Module #{moduleId}
                        </span>
                    </div>
                    </li>
                </ol>
                </nav>
            </div>

            <div className="m-auto mb-5 flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-2/5">
                <InfoBox
                    title="Module Information"
                    rows={[
                    { label: "Name", value: "Log In API" },
                    { label: "Number Of Components", value: "6" },
                    { label: "Created On", value: "2025-03-15 10:32" },
                    { label: "Last Regression", value: "2025-03-15 10:32" },
                    ]}
                    buttonText="Run Module"
                    onButtonClick={() => alert("Running Module...")}
                />
                </div>
                <div className="w-full lg:w-3/5">
                    <PieChart
                        title="Component Ownership Distribution"
                        series={[45, 30, 25]}
                        labels={["Alice", "Bob", "Charlie"]}
                    />
                </div>
            </div>

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
                <div className="w-full lg:w-1/2">
                    <RadialChart
                        title="Components' Run Output"
                        series={[50, 40, 10]}
                        labels={["Succeeded", "Failed", "Unknown"]}
                    />
                </div>
            </div>

            {/* Components Table */}
            <div className="m-auto mt-6 rounded-2xl shadow-md bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Components</h2>
            <Table
                columns={componentColumns}
                data={componentData.slice((currentPage - 1) * 5, currentPage * 5)}
                currentPage={currentPage}
                totalItems={componentData.length}
                pageSize={5}
                onPageChange={setCurrentPage}
                onEdit={(item) => alert(`Edit component: ${item.name}`)}
                onDelete={(item) => alert(`Delete component: ${item.name}`)}
                getEditLink={(item) => `/projects/${projectId}/regression/${regressionId}/module/${moduleId}/component/${item.id}`}
            />
            </div>
        </div>
    );
}
