// Table Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { forwardRef, useMemo } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils';

export interface TableColumn<T = any> {
  key: string;
  header: string;
  width?: number | string;
  sortable?: boolean;
  render?: (row: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  rows: T[];
  renderRow?: (row: T, index: number) => ReactNode;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selected: string[]) => void;
  emptyMessage?: string;
  loading?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({
    columns,
    rows,
    renderRow,
    sortColumn,
    sortDirection,
    onSort,
    selectable = false,
    selectedRows = [],
    onSelectionChange,
    emptyMessage = 'No data available',
    loading = false,
    striped = true,
    hoverable = true,
    className,
    style,
  }, ref) => {
    const sortedColumns = useMemo(() => columns, [columns]);

    const handleHeaderClick = (column: TableColumn) => {
      if (column.sortable && onSort) {
        onSort(column.key);
      }
    };

    const handleRowSelect = (rowId: string, checked: boolean) => {
      if (onSelectionChange) {
        const newSelected = checked
          ? [...selectedRows, rowId]
          : selectedRows.filter(id => id !== rowId);
        onSelectionChange(newSelected);
      }
    };

    const handleSelectAll = (checked: boolean) => {
      if (onSelectionChange) {
        const newSelected = checked ? rows.map(r => (r as any).id).filter(Boolean) : [];
        onSelectionChange(newSelected);
      }
    };

    const allSelected = rows.length > 0 && selectedRows.length === rows.length;
    const someSelected = selectedRows.length > 0 && selectedRows.length < rows.length;

    if (loading) {
      return (
        <div className={cn('table-container', className)} style={style} role="status" aria-label="Loading table data">
          <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
            Loading...
          </div>
        </div>
      );
    }

    if (rows.length === 0) {
      return (
        <div className={cn('table-container', className)} style={style}>
          <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
            {emptyMessage}
          </div>
        </div>
      );
    }

    return (
      <div className={cn('table-container overflow-x-auto', className)} style={style}>
        <table ref={ref} className="table w-full border-collapse" role="grid">
          <thead>
            <tr className="table-header border-b border-[var(--color-border-primary)] bg-[var(--color-surface-container-high)]">
              {selectable && (
                <th className="table-cell px-3 py-2 w-12" style={{ width: 48 }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    // @ts-ignore - indeterminate is a valid property for checkbox
                    indeterminate={someSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="checkbox"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {sortedColumns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'table-cell px-3 py-2 font-medium text-[var(--color-text-secondary)]',
                    'text-left align-middle',
                    column.sortable && 'cursor-pointer hover:text-[var(--color-text-primary)] select-none',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleHeaderClick(column)}
                  aria-sort={sortColumn === column.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                  scope="col"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
                    {column.header}
                    {column.sortable && (
                      <span aria-hidden="true">
                        {sortColumn === column.key
                          ? sortDirection === 'asc'
                            ? ' ▲'
                            : ' ▼'
                          : ' ▼'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const rowId = (row as any).id;
              const isSelected = selectedRows.includes(rowId);
              const customRow = renderRow ? renderRow(row, rowIndex) : null;

              if (customRow) {
                return customRow;
              }

              return (
                <tr
                  key={rowId || rowIndex}
                  className={cn(
                    'table-row transition-colors',
                    striped && rowIndex % 2 === 1 && 'bg-[var(--color-surface-container-high)]',
                    hoverable && 'hover:bg-[var(--color-surface-container-high)]',
                    isSelected && 'bg-[var(--color-primary-glow)]',
                    loading && 'opacity-50 pointer-events-none'
                  )}
                >
                  {selectable && (
                    <td className="table-cell px-3 py-2 w-12" style={{ width: 48 }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => { e.stopPropagation(); handleRowSelect(rowId || rowIndex, e.target.checked); }}
                        className="checkbox"
                        aria-label={`Select row ${rowIndex + 1}`}
                      />
                    </td>
                  )}
                  {sortedColumns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'table-cell px-3 py-2 border-t border-[var(--color-border-primary)]',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                      style={{ width: column.width }}
                    >
                      {column.render ? column.render(row, rowIndex) : (row as any)[column.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

// Table Cell Component
export const TableCell = ({ children, className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('table-cell px-3 py-2', className)} {...props}>
    {children}
  </td>
);

// Table Header Cell Component
export const TableHeaderCell = ({ children, className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn('table-cell px-3 py-2 font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface-container-high)]', className)} {...props}>
    {children}
  </th>
);