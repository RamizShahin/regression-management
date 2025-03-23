import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import styles from "./projects.module.css";

function Projects() {
  const data = React.useMemo(
    () => [
      {
        id: 1,
        name: "Website Redesign",
        status: "In Progress",
        deadline: "2025-03-15",
      },
      {
        id: 2,
        name: "Mobile App Development",
        status: "Completed",
        deadline: "2024-12-01",
      },
      {
        id: 3,
        name: "Cloud Migration",
        status: "In Progress",
        deadline: "2025-05-20",
      },
      {
        id: 4,
        name: "E-commerce Platform",
        status: "Pending",
        deadline: "2025-07-10",
      },
      {
        id: 5,
        name: "Marketing Campaign",
        status: "Completed",
        deadline: "2024-11-20",
      },
      {
        id: 6,
        name: "AI Chatbot Integration",
        status: "In Progress",
        deadline: "2025-06-30",
      },
      {
        id: 7,
        name: "Cybersecurity Audit",
        status: "Pending",
        deadline: "2025-09-15",
      },
      {
        id: 8,
        name: "New Feature Rollout",
        status: "In Progress",
        deadline: "2025-04-05",
      },
      {
        id: 9,
        name: "Customer Support Portal",
        status: "Completed",
        deadline: "2024-10-15",
      },
      {
        id: 10,
        name: "Data Analytics Dashboard",
        status: "Pending",
        deadline: "2025-08-01",
      },
    ],
    []
  );

  // Table Columns
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Project Name",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "deadline",
        header: "Deadline",
      },
    ],
    []
  );

  // State for Filtering
  const [filter, setFilter] = useState("");

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
          <label className={styles.label1}>Projects</label>
          <input
            type="search"
            placeholder="Search for..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.search}
          />
        </div>
        <button className={styles["btn-addProject"]}>Add Project</button>
      </div>
      <div className={styles.table}>
        <label className={styles.label2}>All Projects</label>
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
}

export default Projects;
