import React from "react";
import { useResponsive } from "../../hooks/useResponsive";

interface Column {
  key: string;
  label: string;
  mobileLabel?: string;
  render?: (value: any, row: any) => React.ReactNode;
  className?: string;
}

interface ResponsiveTableProps {
  data: any[];
  columns: Column[];
  onRowClick?: (row: any) => void;
  emptyMessage?: string;
  keyField?: string;
}

export function ResponsiveTable({
  data,
  columns,
  onRowClick,
  emptyMessage = "No data available",
  keyField = "id",
}: ResponsiveTableProps) {
  const { isMobile } = useResponsive();

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map((row, index) => (
          <div
            key={row[keyField] || index}
            className={`
              bg-white border border-gray-200 rounded-lg p-4 space-y-3
              ${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
            `}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((column) => (
              <div
                key={column.key}
                className="flex justify-between items-start"
              >
                <span className="text-sm font-medium text-gray-600">
                  {column.mobileLabel || column.label}:
                </span>
                <span className="text-sm text-gray-900 text-right ml-2">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                  ${column.className || ""}
                `}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr
              key={row[keyField] || index}
              className={`
                hover:bg-gray-50 transition-colors
                ${onRowClick ? "cursor-pointer" : ""}
              `}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`
                    px-6 py-4 whitespace-nowrap text-sm text-gray-900
                    ${column.className || ""}
                  `}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
