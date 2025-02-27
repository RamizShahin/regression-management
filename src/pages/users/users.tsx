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

const Users = () => {
  // Sample Data
  const data = React.useMemo(
    () => [
      { id: 1, name: "John Doe", age: 30 },
      { id: 2, name: "Jane Smith", age: 25 },
      { id: 3, name: "Sam Johnson", age: 35 },
      { id: 4, name: "Alice Brown", age: 28 },
      { id: 5, name: "Michael Lee", age: 40 },
      { id: 6, name: "Emily Davis", age: 22 },
      { id: 7, name: "David Clark", age: 29 },
      { id: 8, name: "Sophia Martinez", age: 33 },
      { id: 9, name: "Daniel White", age: 27 },
      { id: 10, name: "Olivia Harris", age: 31 },
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
        header: "Name",
      },
      {
        accessorKey: "age",
        header: "Age",
      },
    ],
    []
  );

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
          // className={styles.select}
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
        {/* Filtering Input */}
        {/* Table */}
        {/* Pagination Controls */}
      </div>
    </div>
  );
};

export default Users;
