import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth";
import Table from "../../components/TableWithPaging";

const Users = () => {
  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authService.makeAuthenticatedRequest("/api/users");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching users:", error);
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
    const excludedKeys = ["user_id", "password", "created_at", "updated_at"];
    return Object.keys(data[0])
      .filter((key) => !excludedKeys.includes(key))
      .map((key) => ({
        key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
        accessor: key,
      }));
  }, [data]);

  const handleDelete = async (item: any) => {
    const currentUser = authService.getUser();

    if (currentUser?.user_id === item.user_id) {
      alert("You cannot delete your own account.");
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete ${item.fullName || item.email}?`);
    if (!confirmDelete) return;

    try {
      const response = await authService.makeAuthenticatedRequest(`/api/users/${item.user_id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setData((prev) => prev.filter((u) => u.user_id !== item.user_id));
      } else {
        const errMsg = await response.text();
        alert("Delete failed: " + errMsg);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-lg">Users</label>
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
          onClick={() => navigate("/users/add")}
        >
          Add User
        </button>
      </div>

      <Table
        columns={columns}
        data={paginatedData}
        currentPage={currentPage}
        totalItems={filteredData.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        getEditLink={(item: any) => `/users/edit/${item.user_id}`}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Users;
