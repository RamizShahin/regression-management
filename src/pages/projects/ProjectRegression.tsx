import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import InfoBox from "../../components/InfoBox";
import RadialChart from "../../components/RadialChart";
import Table from "../../components/TableWithPaging";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import authService from "../../services/auth";

export default function ProjectRegression() {
  const { id: rawProjectId, regressionId } = useParams<{
    id: string;
    regressionId: string;
  }>();
  const projectId = rawProjectId?.trim();
  // console.warn("project id = ", projectId);
  const [projectName, setProjectName] = useState("Loading...");
  const [currentPage, setCurrentPage] = useState(1);
  const [regression, setRegression] = useState<any>("");
  const [errors, setErrors] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);

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
    const fetchRegression = async () => {
      try {
        const response = await authService.makeAuthenticatedRequest(
          `/api/regression/${regressionId}`
        );
        const regression = await response.json();

        const date = new Date(regression.execution_date);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        regression.execution_date = formattedDate;
        setRegression(regression);
      } catch (error) {
        setRegression(null);
      }
    };

    const fetchErrors = async () => {
      try {
        const response = await authService.makeAuthenticatedRequest(
          `/api/regression/${regressionId}/errors`
        );
        const errors = await response.json();

        setErrors(errors);
      } catch (error) {
        setErrors([]);
      }
    };

    const fetchModules = async () => {
      try {
        const response = await authService.makeAuthenticatedRequest(
          `/api/regression/${regressionId}/modules`
        );
        const data = await response.json();

        const cleanedData = data.map((row: any) => {
          const date = new Date(row.LastRegressionDate);
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, "0");
          const dd = String(date.getDate()).padStart(2, "0");
          const formattedDate = `${yyyy}-${mm}-${dd}`;

          return {
            ...row,
            LastRegressionDate: formattedDate,
          };
        });

        setModules(cleanedData);
      } catch (error) {
        setModules([]);
      }
    };

    fetchRegression();
    fetchErrors();
    fetchModules();
  }, [projectId, regressionId]);

  const errorsHeaderMap: Record<string, string> = {
    test_name: "Name",
    module_name: "Module",
    status: "Error",
  };

  const errorColumns = useMemo(() => {
    if (errors.length === 0) return [];

    const dynamicColumns = Object.keys(errors[0]).map((key) => ({
      key,
      header: errorsHeaderMap[key],
      accessor: key,
    }));

    return dynamicColumns;
  }, [errors]);

  const modulesHeaderMap: Record<string, string> = {
    module_name: "Module Name",
    ComponentCount: "Components",
    LastRegressionDate: "Last Regression",
  };

  const moduleColumns = useMemo(() => {
    if (modules.length === 0) return [];

    const excludedKeys = ["module_id"];
    const dynamicColumns = Object.keys(modules[0])
      .filter((key) => !excludedKeys.includes(key))
      .map((key) => ({
        key,
        header: modulesHeaderMap[key],
        accessor: key,
      }));

    return dynamicColumns;
  }, [modules]);

  const outcomeTotals = [
    regression.passed || 0,
    regression.failed || 0,
    regression.unknown || 0,
  ];

  // console.log(regression);

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-7">
        <nav aria-label="Back" className="sm:hidden">
          <Link
            to={`/projects/${projectId}`}
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
        <div className="w-full lg:w-2/4">
          <InfoBox
            title="Regression Info"
            rows={[
              { label: "Name", value: regression.run_name || "missing name" },
              { label: "Execution Date", value: regression.execution_date },
              {
                label: "Status",
                value:
                  regression.failed > 0
                    ? "FAIL"
                    : regression.unknown > 0
                    ? "UNKOWN"
                    : "PASS",
              },
            ]}
            buttonText="Run Regression Modules"
            onButtonClick={() => alert("Running Modules...")}
          />
        </div>

        <div className="w-full lg:w-2/4">
          {regression ? (
            <RadialChart
              title="Test Case Outcomes"
              series={outcomeTotals}
              labels={["Succeeded", "Failed", "Unknown"]}
            />
          ) : (
            <div className="text-gray-400">Loading chart data...</div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="rounded-2xl shadow-md bg-gray-900 p-6 flex-grow">
        <h2 className="text-lg font-semibold text-white mb-4">
          Failed/Unknown Test Cases
        </h2>
        {errors.length > 0 ? (
          <Table
            columns={errorColumns}
            data={errors.slice((currentPage - 1) * 5, currentPage * 5)}
            currentPage={currentPage}
            totalItems={errors.length}
            pageSize={5}
            onPageChange={setCurrentPage}
            getEditLink={() => ""}
          />
        ) : (
          <div className="text-gray-400 text-center">no data</div>
        )}
      </div>

      {/* Modules Table */}
      <div className="m-auto mt-6 rounded-2xl shadow-md bg-gray-900 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Modules</h2>
        <Table
          columns={moduleColumns}
          data={modules.slice((currentPage - 1) * 5, currentPage * 5)}
          currentPage={currentPage}
          totalItems={modules.length}
          pageSize={5}
          onPageChange={setCurrentPage}
          onEdit={(item) => alert(`Edit module: ${item.name}`)}
          onDelete={(item) => alert(`Delete module: ${item.name}`)}
          getEditLink={(item) =>
            `/projects/${projectId}/regression/${regressionId}/module/${item.module_id}`
          }
        />
      </div>
    </div>
  );
}
