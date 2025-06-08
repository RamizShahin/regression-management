import { useState } from 'react'
import { Link } from 'react-router-dom'
import Table, { type Column } from "../../components/TableWithPaging";


export default function Parsers() {
  const [currentPage, setCurrentPage] = useState(1);

  type ParserRow = {
  name: string;
  issuer: string;
  issueDate: string;
};

const columns: Column<ParserRow>[] = [
    { key: "name", header: "Parser Name", accessor: "name" },
    { key: "issuer", header: "Parser Issuer", accessor: "issuer" },
    { key: "issueDate", header: "Issue Date", accessor: "issueDate" },
  ];

  const data: ParserRow[] = [
    { name: "ErrorLogParser", issuer: "LogCorp", issueDate: "2024-05-01" },
    { name: "AccessLogParser", issuer: "SysTools", issueDate: "2023-11-15" },
    { name: "EventParser", issuer: "EventMasters", issueDate: "2024-02-10" },
    { name: "SystemParser", issuer: "SysAdmin Inc.", issueDate: "2023-12-05" },
    { name: "NetworkParser", issuer: "NetSecure", issueDate: "2024-03-22" },
    { name: "CrashParser", issuer: "DebugTools", issueDate: "2024-01-17" },
    { name: "TraceParser", issuer: "TraceSoft", issueDate: "2024-04-11" },
    { name: "AppLogParser", issuer: "AppSuite", issueDate: "2024-02-25" },
    { name: "SecurityParser", issuer: "SecureTech", issueDate: "2023-10-30" },
    { name: "ServiceParser", issuer: "InfraCorp", issueDate: "2024-05-15" },
    { name: "ErrorLogParser", issuer: "LogCorp", issueDate: "2024-05-01" },
    { name: "AccessLogParser", issuer: "SysTools", issueDate: "2023-11-15" },
    { name: "EventParser", issuer: "EventMasters", issueDate: "2024-02-10" },
    { name: "SystemParser", issuer: "SysAdmin Inc.", issueDate: "2023-12-05" },
    { name: "NetworkParser", issuer: "NetSecure", issueDate: "2024-03-22" },
    { name: "CrashParser", issuer: "DebugTools", issueDate: "2024-01-17" },
    { name: "TraceParser", issuer: "TraceSoft", issueDate: "2024-04-11" },
    { name: "ErrorLogParser", issuer: "LogCorp", issueDate: "2024-05-01" },
    { name: "AccessLogParser", issuer: "SysTools", issueDate: "2023-11-15" },
    { name: "EventParser", issuer: "EventMasters", issueDate: "2024-02-10" },
    { name: "SystemParser", issuer: "SysAdmin Inc.", issueDate: "2023-12-05" },
    { name: "NetworkParser", issuer: "NetSecure", issueDate: "2024-03-22" },
    { name: "CrashParser", issuer: "DebugTools", issueDate: "2024-01-17" },
    { name: "TraceParser", issuer: "TraceSoft", issueDate: "2024-04-11" },
    { name: "AppLogParser", issuer: "AppSuite", issueDate: "2024-02-25" },
    { name: "SecurityParser", issuer: "SecureTech", issueDate: "2023-10-30" },
    { name: "ServiceParser", issuer: "InfraCorp", issueDate: "2024-05-15" },
    { name: "ErrorLogParser", issuer: "LogCorp", issueDate: "2024-05-01" },
    { name: "AccessLogParser", issuer: "SysTools", issueDate: "2023-11-15" },
    { name: "EventParser", issuer: "EventMasters", issueDate: "2024-02-10" },
    { name: "SystemParser", issuer: "SysAdmin Inc.", issueDate: "2023-12-05" },
    { name: "NetworkParser", issuer: "NetSecure", issueDate: "2024-03-22" },
    { name: "CrashParser", issuer: "DebugTools", issueDate: "2024-01-17" },
    { name: "TraceParser", issuer: "TraceSoft", issueDate: "2024-04-11" },
    { name: "ErrorLogParser", issuer: "LogCorp", issueDate: "2024-05-01" },
    { name: "AccessLogParser", issuer: "SysTools", issueDate: "2023-11-15" },
    { name: "EventParser", issuer: "EventMasters", issueDate: "2024-02-10" },
    { name: "SystemParser", issuer: "SysAdmin Inc.", issueDate: "2023-12-05" },
    { name: "NetworkParser", issuer: "NetSecure", issueDate: "2024-03-22" },
    { name: "CrashParser", issuer: "DebugTools", issueDate: "2024-01-17" },
    { name: "TraceParser", issuer: "TraceSoft", issueDate: "2024-04-11" },
    { name: "AppLogParser", issuer: "AppSuite", issueDate: "2024-02-25" },
    { name: "SecurityParser", issuer: "SecureTech", issueDate: "2023-10-30" },
    { name: "ServiceParser", issuer: "InfraCorp", issueDate: "2024-05-15" },
    { name: "ErrorLogParser", issuer: "LogCorp", issueDate: "2024-05-01" },
    { name: "AccessLogParser", issuer: "SysTools", issueDate: "2023-11-15" },
    { name: "EventParser", issuer: "EventMasters", issueDate: "2024-02-10" },
    { name: "SystemParser", issuer: "SysAdmin Inc.", issueDate: "2023-12-05" },
    { name: "NetworkParser", issuer: "NetSecure", issueDate: "2024-03-22" },
    { name: "CrashParser", issuer: "DebugTools", issueDate: "2024-01-17" },
    { name: "TraceParser", issuer: "TraceSoft", issueDate: "2024-04-11" },
  ];

  const handleEdit = (item: ParserRow) => {
    alert(`Edit clicked for: ${item.name}`);
  };

  const handleDelete = (item: ParserRow) => {
    alert(`Delete clicked for: ${item.name}`);
  };

  const dataRowsSize: number = 8;

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb and Heading */}
        <div>
          <nav aria-label="Breadcrumb" className="hidden sm:flex">
            <ol role="list" className="flex items-center space-x-4">
              <li>
                <div className="flex items-center">
                  <Link to="/parsers" aria-current="page" className="ml-1 mb-5 text-sm font-medium text-gray-400 hover:text-gray-200">
                    Parsers
                  </Link>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="mt-4 md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl/7 font-bold text-white sm:truncate sm:text-3xl sm:tracking-tight">
              Parsers
            </h2>
            <p className="mt-1 text-sm text-gray-300">
              Explore all available Parsers designed to efficiently handle your log files.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link to="/parsers/add">
              <button
                type="button"
                className="block rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-600"
              >
                Add new Parser
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-8">

          <Table
            columns={columns}
            data={data.slice((currentPage - 1) * dataRowsSize, currentPage * dataRowsSize)}
            currentPage={currentPage}
            totalItems={data.length}
            pageSize={dataRowsSize}
            onPageChange={setCurrentPage}
            onEdit={handleEdit}
            onDelete={handleDelete}
            getEditLink = ""
          />
        </div>
      </div>
    </div>
  )
}
