import React from 'react';

import clsx from 'clsx';

import { TableProps } from '@/types/table';

function Table<T extends { id: string }>({
  columns,
  data,
  emptyText = 'Không có dữ liệu.',
  onRowClick = () => {},
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[300px] w-full bg-white rounded shadow border border-gray-200 text-sm sm:text-base table-fixed">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col, idx) => (
              <th
                key={col.title + idx}
                className={clsx(
                  'px-2 py-2 border-b border-gray-200 text-left font-semibold text-gray-800 truncate',
                  col.className
                )}
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
                onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) =>
                  (e.key === 'Enter' || e.key === ' ') && onRowClick(row)
                }
                role="button"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.title + colIdx}
                    className={clsx(
                      'px-2 py-2 border-b border-gray-200 text-left text-gray-800 truncate',
                      col.className
                    )}
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
