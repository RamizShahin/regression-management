import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LineChart from "../../components/LineChart";
import AreaChart from "../../components/AreaChart";
import TeamCard from "../../components/TeamCard";
import RadialChart from "../../components/RadialChart";
import Table, { type Column } from "../../components/TableWithPaging";
import authService from "../../services/auth";

export default function ProjectPortal() {
  const { id: rawProjectId } = useParams<{ id: string }>();
  const projectId = rawProjectId?.trim();
  const [currentPage, setCurrentPage] = useState(1);
  const [projectName, setProjectName] = useState("Loading...");
  const [selectedMonth, setSelectedMonth] = useState<string>();
  const [regressions, setRegressions] = useState<any[]>([]);
  const [projectTeam, setProjectTeam] = useState<any[]>([]);
  const [lineChartFromDate, setLineChartFromDate] = useState<string>();
  const [lineChartToDate, setLineChartToDate] = useState<string>();
  const [areaChartFromDate, setAreaChartFromDate] = useState<string>();
  const [areaChartToDate, setAreaChartToDate] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!projectId) {
          console.warn("⚠️ projectId is undefined!");
          setProjectName("Unknown Project");
          return;
        }

        const response = await authService.makeAuthenticatedRequest(
          `/api/projects/${projectId}`
        );
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

  // fetching all regression runs
  useEffect(() => {
    const fetchRegressions = async () => {
      const response = await authService.makeAuthenticatedRequest(
        `/api/regressions/project/${projectId}`
      );
      const data = await response.json();

      const cleanedData = data.map((row: any) => {
        const date = new Date(row.execution_date);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        return {
          ...row,
          execution_date: formattedDate,
          successRate:
            row.total_tests > 0
              ? `${((row.passed / row.total_tests) * 100).toFixed(2)}%`
              : "0%",
        };
      });

      setRegressions(cleanedData);
    };

    const fetchProjectTeam = async () => {
      const response = await authService.makeAuthenticatedRequest(
        `/api/regressions/project/${projectId}/team`
      );
      const data = await response.json();

      const cleanedData = data.map((row: any) => ({
        ...row,
        role: row.role.charAt(0).toUpperCase() + row.role.slice(1),
      }));

      setProjectTeam(cleanedData);
    };
    fetchProjectTeam();
    fetchRegressions();
  }, [projectId]);

  const { lineChartSeries, lineChartCategories } = useMemo(() => {
    const grouped: Record<
      string,
      { passed: number; failed: number; unknown: number }
    > = {};

    regressions.forEach((regression) => {
      const date = regression.execution_date;

      if (lineChartFromDate && date < lineChartFromDate) return;
      if (lineChartToDate && date > lineChartToDate) return;

      if (!grouped[date]) {
        grouped[date] = { passed: 0, failed: 0, unknown: 0 };
      }

      grouped[date].passed += regression.passed || 0;
      grouped[date].failed += regression.failed || 0;
      grouped[date].unknown += regression.unknown || 0;
    });

    const sortedMonths = Object.keys(grouped).sort();
    const lineChartCategories = sortedMonths;

    const passedData = sortedMonths.map((date) => grouped[date].passed);
    const failedData = sortedMonths.map((date) => grouped[date].failed);
    const unknownData = sortedMonths.map((date) => grouped[date].unknown);

    const lineChartSeries = [
      { name: "Passed", data: passedData },
      { name: "Failed", data: failedData },
      { name: "Unknown", data: unknownData },
    ];

    return { lineChartSeries, lineChartCategories };
  }, [regressions, lineChartFromDate, lineChartToDate]);

  const { areaChartSeries, areaChartCategories } = useMemo(() => {
    const grouped: Record<string, number> = {};

    regressions.forEach((regression) => {
      const date = regression.execution_date.slice(0, 7);

      if (areaChartFromDate && date < areaChartFromDate) return;
      if (areaChartToDate && date > areaChartToDate) return;

      if (!grouped[date]) {
        grouped[date] = 0;
      }

      grouped[date] += regression.total_tests || 0;
    });

    const sortedMonths = Object.keys(grouped).sort();
    const areaChartCategories = sortedMonths;
    const areaChartSeries = sortedMonths.map((date) => grouped[date]);

    return { areaChartSeries, areaChartCategories };
  }, [regressions, areaChartFromDate, areaChartToDate]);

  const regColumns = useMemo(() => {
    if (regressions.length === 0) return [];

    const excludedKeys = ["run_id", "project_id"];
    const dynamicColumns = Object.keys(regressions[0])
      .filter((key) => !excludedKeys.includes(key))
      .map((key) => ({
        key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
        accessor: key,
      }));

    return dynamicColumns;
  }, [regressions]);

  const filteredRegressions = useMemo(() => {
    if (!selectedMonth) return regressions;

    return regressions.filter(
      (r) => r.execution_date.slice(0, 7) === selectedMonth
    );
  }, [regressions, selectedMonth]);

  const handleLineChartDateChange = (from: string, to: string) => {
    setLineChartFromDate(from);
    setLineChartToDate(to);
  };

  const handleAreaChartDateChange = (from: string, to: string) => {
    setAreaChartFromDate(from);
    setAreaChartToDate(to);
  };

  const outcomeTotals = [
    regressions.reduce((sum, r) => sum + (r.passed || 0), 0),
    regressions.reduce((sum, r) => sum + (r.failed || 0), 0),
    regressions.reduce((sum, r) => sum + (r.unknown || 0), 0),
  ];

  return (
    <div className="p-6">
      <div className="mb-7">
        <nav aria-label="Breadcrumb" className="hidden sm:flex">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div className="flex items-center">
                <span className="ml-4 text-sm font-medium text-gray-400">
                  {projectName}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="m-auto mb-5 flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/3">
          {regressions.length === 0 ? (
            <div className="text-gray-400">Loading chart data...</div>
          ) : (
            <RadialChart
              title="Test Case Outcomes"
              series={outcomeTotals}
              labels={["Succeeded", "Failed", "Unknown"]}
            />
          )}
        </div>
        <div className="w-full lg:w-2/3">
          <LineChart
            title="Tests per month"
            series={lineChartSeries}
            categories={lineChartCategories}
            onDateChange={handleLineChartDateChange}
            defaultFromDate=""
            defaultToDate=""
          />
        </div>
      </div>

      <div className="m-auto flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3">
          <AreaChart
            title="Test Over Time"
            series={[
              {
                name: "Tests",
                data: areaChartSeries,
              },
            ]}
            categories={areaChartCategories}
            onDateChange={handleAreaChartDateChange}
            defaultFrom=""
            defaultTo=""
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TeamCard title="Assigned Team" members={projectTeam} />
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
        {filteredRegressions.length > 0 ? (
          <Table
            columns={regColumns}
            data={filteredRegressions.slice(
              (currentPage - 1) * 5,
              currentPage * 5
            )}
            currentPage={currentPage}
            totalItems={regressions.length}
            pageSize={5}
            onPageChange={setCurrentPage}
            onEdit={(item) =>
              navigate(`/projects/${projectId}/regression/${item.run_id}`)
            }
            onDelete={(item) => alert(`Delete clicked for: ${item.run_id}`)}
            getEditLink={(item) =>
              `/projects/${projectId}/regression/${item.run_id}`
            }
          />
        ) : (
          <div className="text-gray-400 text-center">no data</div>
        )}
      </div>
    </div>
  );
}
