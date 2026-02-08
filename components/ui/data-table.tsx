import * as React from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  readonly key: keyof T | string;
  readonly header: string;
  readonly className?: string;
  readonly render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  readonly columns: ReadonlyArray<Column<T>>;
  readonly data: ReadonlyArray<T>;
  readonly keyExtractor: (item: T) => string;
  readonly className?: string;
  readonly emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  className,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item) => (
            <tr key={keyExtractor(item)}>
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={cn("px-6 py-4 text-sm", column.className)}
                >
                  {column.render
                    ? column.render(item)
                    : String(item[column.key as keyof T] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
