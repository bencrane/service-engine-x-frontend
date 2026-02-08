import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface OrderTotalProps {
  readonly subtotal?: number;
  readonly tax?: number;
  readonly total?: number;
}

export function OrderTotal({ subtotal, tax, total }: OrderTotalProps) {
  if (subtotal === undefined && total === undefined) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
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
            <div className="flex justify-between border-t border-border pt-2 mt-2">
              <span className="text-lg font-medium text-foreground">Total</span>
              <span className="text-2xl font-semibold tabular-nums text-foreground">
                {formatCurrency(total)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
