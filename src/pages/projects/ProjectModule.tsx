import { useEffect, useMemo, useState } from "react";
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
  const {
    id: rawProjectId,
    regressionId,
    moduleId,
  } = useParams<{
    id: string;
    regressionId: string;
    moduleId: string;
  }>();
  const projectId = rawProjectId?.trim();
  const [projectName, setProjectName] = useState("Loading...");
  const [currentPage, setCurrentPage] = useState(1);
  const [module, setModule] = useState<any>("");
  const [contribution, setContribution] = useState<any>();
  const [errors, setErrors] = useState<any[]>([]);
  const [components, setComponents] = useState<any[]>([]);

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
    const fetchModule = async () => {
      try {
        const response = await authService.makeAuthenticatedRequest(
          `/api/regression/${regressionId}/module/${moduleId}`
        );

        if (!response.ok) throw new Error("Failed to fetch module");
        const module = await response.json();

        const date = new Date(module.LastRegDate);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        module.LastRegDate = formattedDate;

        setModule(module);
      } catch (err) {
        console.log("error: ", err);
        setModule(null);
      }
    };

    const fetchContribution = async () => {
      try {
        const response = await authService.makeAuthenticatedRequest(
          `/api/regression/${regressionId}/module/${moduleId}/contribution`
        );

        if (!response.ok) throw new Error("Failed to fetch contribution");
        let contribution = await response.json();

        const componentCount = contribution.map((c: any) => {
          return c.ComponentCount;
        });

        const developers = contribution.map((c: any) => {
          return c.UserName;
        });

        contribution = {
          developers: developers,
          componentCount: componentCount,
        };

        setContribution(contribution);
      } catch (err) {
        console.log("error: ", err);
        setContribution(contribution);
      }
    };

    const fetchErrors = async () => {
      try {
        const response = await authService.makeAuthenticatedRequest(
          `/api/regression/${regressionId}/module/${moduleId}/errors`
        );
        const errors = await response.json();

        setErrors(errors);
      } catch (error) {
        setErrors([]);
      }
    };

    const fetchComponents = async () => {
      try {
        const response = await authService.makeAuthenticatedRequest(
          `/api/regression/${regressionId}/module/${moduleId}/components`
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

        setComponents(cleanedData);
      } catch (error) {
        setComponents([]);
      }
    };

    fetchModule();
    fetchContribution();
    fetchErrors();
    fetchComponents();
  }, [projectId, regressionId, moduleId]);

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

  const componentsHeaderMap: Record<string, string> = {
    component_name: "Component Name",
    name: "Developer Name",
    LastRegressionDate: "Last Regression",
  };

  const componentColumns = useMemo(() => {
    if (components.length === 0) return [];

    const excludedKeys = ["component_id"];
    const dynamicColumns = Object.keys(components[0])
      .filter((key) => !excludedKeys.includes(key))
      .map((key) => ({
        key,
        header: componentsHeaderMap[key],
        accessor: key,
      }));

    return dynamicColumns;
  }, [components]);

  const outcomeTotals = [
    Number(module.passed) || 0,
    Number(module.failed) || 0,
    Number(module.unknown) || 0,
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
              { label: "Name", value: module.module_name },
              { label: "Number Of Components", value: module.ComponentCount },
              { label: "Last Regression", value: module.LastRegDate },
            ]}
            buttonText="Run Module"
            onButtonClick={() => alert("Running Module...")}
          />
        </div>
        <div className="w-full lg:w-3/5">
          {contribution ? (
            <PieChart
              title="Component Ownership Distribution"
              series={contribution.componentCount}
              labels={contribution.developers}
            />
          ) : (
            <div className="text-gray-400">Loading chart data...</div>
          )}
        </div>
      </div>

      <div className="m-auto flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3 flex flex-col">
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
        </div>
        <div className="w-full lg:w-1/2">
          {module ? (
            <RadialChart
              title="Components' Run Output"
              series={outcomeTotals}
              labels={["Succeeded", "Failed", "Unknown"]}
            />
          ) : (
            <div className="text-gray-400">Loading chart data...</div>
          )}
        </div>
      </div>

      {/* Components Table */}
      <div className="m-auto mt-6 rounded-2xl shadow-md bg-gray-900 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Components</h2>
        <Table
          columns={componentColumns}
          data={components.slice((currentPage - 1) * 5, currentPage * 5)}
          currentPage={currentPage}
          totalItems={components.length}
          pageSize={5}
          onPageChange={setCurrentPage}
          onEdit={(item) => alert(`Edit component: ${item.name}`)}
          onDelete={(item) => alert(`Delete component: ${item.name}`)}
          getEditLink={(item) =>
            `/projects/${projectId}/regression/${regressionId}/module/${moduleId}/component/${item.component_id}`
          }
        />
      </div>
    </div>
  );
}
