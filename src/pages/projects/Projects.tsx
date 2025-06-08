import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth";
import Table from "../../components/TableWithPaging";

const Projects = () => {
  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authService.makeAuthenticatedRequest("/api/projects");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(filter.toLowerCase())
    )
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    const excludedKeys = ["project_id"];
    return Object.keys(data[0])
      .filter((key) => !excludedKeys.includes(key))
      .map((key) => ({
        key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
        accessor: key,
      }));
  }, [data]);

  const handleDelete = async (item: any) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete project "${item.project_name}"?`);
    if (!confirmDelete) return;

    try {
      const response = await authService.makeAuthenticatedRequest(`/api/projects/${item.project_id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setData((prev) => prev.filter((p) => p.project_id !== item.project_id));
      } else {
        const errMsg = await response.text();
        alert("Delete failed: " + errMsg);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("An error occurred while deleting the project.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-lg">Projects</label>
          <input
            type="search"
            placeholder="Search for..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md bg-gray-800 text-white px-3 py-2 border border-gray-600 focus:outline-none focus:ring focus:ring-purple-500 text-sm"
          />
        </div>
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm"
          onClick={() => navigate("/projects/add")}
        >
          Add Project
        </button>
      </div>

      <Table
        columns={columns}
        data={paginatedData}
        currentPage={currentPage}
        totalItems={filteredData.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        getEditLink={(item: any) => `/projects/${item.project_id}`}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Projects;
