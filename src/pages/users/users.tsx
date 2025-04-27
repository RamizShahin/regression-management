import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import styles from "./users.module.css";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth";

const Users = () => {
  // Sample Data
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authService.makeAuthenticatedRequest(
          "/api/users"
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  // Table Columns
  const columns = React.useMemo(() => {
    if (data.length === 0) return [];

    const excludedKeys = ["user_id", "password", "created_at", "updated_at"]; // keys you want to skip

    return Object.keys(data[0])
      .filter((key) => !excludedKeys.includes(key)) // filter them out
      .map((key) => ({
        accessorKey: key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
      }));
  }, [data]);

  // State for Filtering
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  // Create Table Instance
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: filter, // Set global filter state
    },
    onGlobalFilterChange: setFilter, // Update filter state
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles["search-container"]}>
          <label className={styles.label1}>Users</label>
          <input
            type="search"
            placeholder="Search for..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.search}
          />
        </div>
        <button
          className={styles["btn-addUser"]}
          onClick={() => navigate("/users/add")}
        >
          Add User
        </button>
      </div>
      <div className={styles.table}>
        <label className={styles.label2}>All Users</label>
        <table border={1} cellSpacing="0" cellPadding="">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc"
                      ? " 🔼"
                      : header.column.getIsSorted() === "desc"
                      ? " 🔽"
                      : " ↕"}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={styles.trow}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
        Rows per page:
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[1, 2, 5, 10].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={styles["btn-next-prev"]}
        >
          &lt;
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={styles["btn-next-prev"]}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Users;
