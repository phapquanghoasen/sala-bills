export interface Column<T> {
  title: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyText?: string;
  onRowClick?: (row: T) => void;
}
