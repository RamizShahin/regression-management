import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LineChart from "../../components/LineChart";
import AreaChart from "../../components/AreaChart";
import TeamCard from "../../components/TeamCard";
import RadialChart from "../../components/RadialChart";
import Table, { type Column } from "../../components/TableWithPaging";
import authService from "../../services/auth";

type RegressionRow = {
  id: number;
  name: string;
  dateOfRun: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  unknownTests: number;
  successRate: string;
  runtime: string;
};

export default function ProjectPortal() {
  const { id: rawProjectId } = useParams<{ id: string }>();
  const projectId = rawProjectId?.trim();
  const [currentPage, setCurrentPage] = useState(1);
  const [projectName, setProjectName] = useState("Loading...");
  const [selectedMonth, setSelectedMonth] = useState("2025-06");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!projectId) {
          console.warn("⚠️ projectId is undefined!");
          setProjectName("Unknown Project");
          return;
        }

        const response = await authService.makeAuthenticatedRequest(`/api/projects/${projectId}`);
        if (!response.ok) {
          console.error("Failed to fetch project:", await response.text());
          setProjectName("Unknown Project");
          return;
        }

        const project = await response.json();
        setProjectName(project.project_name);
      } catch (error) {
        console.error("Error fetching project:", error);
        setProjectName("Unknown Project");
      }
    };

    fetchProject();
  }, [projectId]);

  const series = [
    { name: "Passed", data: [10, 15, 20, 25, 30, 5, 10, 15, 20, 25] },
    { name: "Failed", data: [5, 10, 15, 20, 25, 2, 7, 12, 17, 22] },
    { name: "Unknown", data: [2, 7, 12, 17, 22, 10, 15, 20, 25, 30] },
  ];

  const categories = ["#1", "#2", "#3", "#4", "#5", "#6", "#7", "#8", "#9", "#10"];

  const regColumns: Column<RegressionRow>[] = [
    { key: "name", header: "Regression Name", accessor: "name" },
    { key: "dateOfRun", header: "Execution Date", accessor: "dateOfRun" },
    { key: "totalTests", header: "Total Tests", accessor: "totalTests" },
    { key: "passedTests", header: "Passed", accessor: "passedTests" },
    { key: "failedTests", header: "Failed", accessor: "failedTests" },
    { key: "unknownTests", header: "Unknown", accessor: "unknownTests" },
    { key: "successRate", header: "Success Rate", accessor: "successRate" },
    { key: "runtime", header: "Runtime", accessor: "runtime" },
  ];

  const regData: RegressionRow[] = [
    {
      id: 1,
      name: "Regression A",
      dateOfRun: "2025-06-01",
      totalTests: 100,
      passedTests: 92,
      failedTests: 5,
      unknownTests: 3,
      successRate: "92%",
      runtime: "5m 30s",
    },
    {
      id: 2,
      name: "Regression B",
      dateOfRun: "2025-06-04",
      totalTests: 80,
      passedTests: 70,
      failedTests: 7,
      unknownTests: 3,
      successRate: "87.5%",
      runtime: "4m 45s",
    },
  ];

  const handleEdit = (item: RegressionRow) => {
    navigate(`/projects/${projectId}/regression/${item.id}`);
  };


  const handleDelete = (item: RegressionRow) => {
    alert(`Delete clicked for: ${item.name}`);
  };

  const handleDateChange = (from: string, to: string) => {
    console.log(`Date range changed from ${from} to ${to}`);
  };

  return (
    <div className="p-6">
      <div className="mb-7">
        <nav aria-label="Breadcrumb" className="hidden sm:flex">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div className="flex items-center">
                <span className="ml-4 text-sm font-medium text-gray-400">{projectName}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="m-auto mb-5 flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/3">
          <RadialChart
            title="Test Case Outcomes"
            series={[50, 40, 10]}
            labels={["Succeeded", "Failed", "Unknown"]}
          />
        </div>
        <div className="w-full lg:w-2/3">
          <LineChart
            title="Tests per month"
            series={series}
            categories={categories}
            onDateChange={handleDateChange}
            defaultFromDate="2025-05-20"
            defaultToDate="2025-05-27"
          />
        </div>
      </div>

      <div className="m-auto flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3">
          <AreaChart
            title="Test Over Time"
            series={[
              { name: "Tests", data: [50, 70, 90, 80, 100, 110, 90, 75, 95, 100] }
            ]}
            categories={[
              "Jun 2023", "Jul 2023", "Aug 2023", "Sep 2023", "Oct 2023",
              "Nov 2023", "Dec 2023", "Jan 2024", "Feb 2024", "Mar 2024"
            ]}
            onDateChange={(from, to) => {
              console.log("Selected:", from, "to", to);
              // in future: fetch from backend by month range
            }}
            defaultFrom="2023-06"
            defaultTo="2024-03"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TeamCard
            title="Assigned Team"
            members={[
              { name: "John Carter", email: "john@example.com", role: "User" },
              { name: "Sophie Moore", email: "sophie@example.com", role: "Manager" },
              { name: "Matt Cannon", email: "matt@example.com", role: "Admin" },
              { name: "Ansam Rihan", email: "ansam@example.com", role: "Admin" },
              { name: "Ramiz Shahin", email: "ramiz@example.com", role: "Admin" },
            ]}
          />
        </div>
      </div>

      <div className="m-auto mt-6 rounded-2xl shadow-md bg-gray-900 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Regressions</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-gray-800 text-white px-3 py-1.5 rounded-md border border-gray-700"
            />
            <button
              className="bg-purple-500 text-white px-4 py-1.5 rounded-md hover:bg-purple-600"
              onClick={() => navigate(`/projects/${projectId}/new-regression`)}
            >
              New Regression
            </button>
          </div>
        </div>
          <Table
            columns={regColumns}
            data={regData.slice((currentPage - 1) * 5, currentPage * 5)}
            currentPage={currentPage}
            totalItems={regData.length}
            pageSize={5}
            onPageChange={setCurrentPage}
            onEdit={handleEdit}
            onDelete={handleDelete}
            getEditLink={(item) => `/projects/${projectId}/regression/${item.id}`}
          />
        </div>
    </div>
  );
}
