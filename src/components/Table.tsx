export type Column<T> = {
  key: string;
  header: string;
  accessor: keyof T;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

function getPaginationRange(
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number = 5
): (number | "...")[] {
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  const leftSiblingIndex = Math.max(currentPage - 1, 2);
  const rightSiblingIndex = Math.min(currentPage + 1, totalPages - 1);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  pages.push(1);

  if (showLeftEllipsis) {
    pages.push("...");
  } else {
    for (let i = 2; i < leftSiblingIndex; i++) {
      pages.push(i);
    }
  }

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push("...");
  } else {
    for (let i = rightSiblingIndex + 1; i < totalPages; i++) {
      pages.push(i);
    }
  }

  pages.push(totalPages);

  return pages;
}

export default function Table<T>({
  columns,
  data,
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: TableProps<T>) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const paginationNumbers = getPaginationRange(currentPage, totalPages);

  return (
    <>
      <table className="min-w-full divide-y divide-gray-700 text-sm">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 text-left font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-700">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                  {String(row[col.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-5 flex items-center justify-between text-gray-400 text-sm">
        <div className="hidden sm:block">
          Showing {startItem} to {endItem} of {totalItems} results
        </div>
        <div className="flex items-center space-x-1">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="rounded px-2 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
          >
            &lt;
          </button>
          <div className="hidden sm:flex space-x-1">
            {paginationNumbers.map((page, idx) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-3 py-1 text-gray-500 select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`rounded px-3 py-1 ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="rounded px-2 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    </>
  );
}
