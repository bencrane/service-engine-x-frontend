import { CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Billing
        </h1>
        <p className="mt-1 text-muted-foreground">
          Invoices and payment information
        </p>
      </header>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-center text-muted-foreground">
            No billing information yet. Invoices will appear here when available.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
