import { TableProps } from '@/types/table';
import React from 'react';

function Table<T extends { id: string }>({ columns, data, emptyText = 'Không có dữ liệu.', onRowClick = () => {} }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[300px] w-full bg-white rounded shadow border border-gray-200 text-sm sm:text-base table-fixed">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col, idx) => (
              <th
                key={col.title + idx}
                className={col.className || 'px-2 py-2 border-b border-gray-200 text-left font-semibold text-gray-800'}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center text-gray-500 py-6"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map(row => (
              <tr
                key={row.id}
                className="hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => onRowClick(row)}
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) => (e.key === 'Enter' || e.key === ' ') && onRowClick(row)}
                role="button"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.title + colIdx}
                    className={col.className || 'px-2 py-2 border-b border-gray-200 text-left text-gray-800'}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
