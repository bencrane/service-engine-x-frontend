import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/lib/utils";
import type { LineItem } from "@/types";

interface LineItemsTableProps {
  readonly lineItems: ReadonlyArray<LineItem>;
  readonly subtotal?: number;
  readonly tax?: number;
  readonly total?: number;
}

export function LineItemsTable({
  lineItems,
  subtotal,
  tax,
  total,
}: LineItemsTableProps) {
  if (lineItems.length === 0) {
    return null;
  }

  const columns = [
    {
      key: "description" as const,
      header: "Description",
    },
    {
      key: "quantity" as const,
      header: "Qty",
      className: "text-right",
      render: (item: LineItem) => (
        <span className="tabular-nums">{item.quantity}</span>
      ),
    },
    {
      key: "unitPrice" as const,
      header: "Unit Price",
      className: "text-right",
      render: (item: LineItem) => (
        <span className="tabular-nums">{formatCurrency(item.unitPrice)}</span>
      ),
    },
    {
      key: "total" as const,
      header: "Total",
      className: "text-right",
      render: (item: LineItem) => (
        <span className="tabular-nums">{formatCurrency(item.total)}</span>
      ),
    },
  ];

  const showTotals = subtotal !== undefined || total !== undefined;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Line Items
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={lineItems}
        keyExtractor={(item) => item.id}
      />
      {showTotals && (
        <div className="border-t border-border bg-muted/50 px-6 py-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              {subtotal !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="tabular-nums text-foreground">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              )}
              {tax !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="tabular-nums text-foreground">
                    {formatCurrency(tax)}
                  </span>
                </div>
              )}
              {total !== undefined && (
                <div className="flex justify-between border-t border-border pt-2 text-base font-medium">
                  <span className="text-foreground">Total</span>
                  <span className="tabular-nums text-foreground">
                    {formatCurrency(total)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
