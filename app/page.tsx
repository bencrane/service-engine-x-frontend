import Link from "next/link";
import { ArrowRight, FileText, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Test order ID - replace with a real order ID from your API
const TEST_ORDER_ID = "test-order-123";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Welcome to Service Engine
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your customer portal for viewing proposals and tracking orders. Access
          all your service information in one place.
        </p>
      </section>

      {/* Feature Cards */}
      <section className="grid gap-6 sm:grid-cols-2">
        <Card className="relative overflow-hidden">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Proposals</CardTitle>
            <CardDescription>
              View and sign proposals sent to you. Review line items, pricing,
              and terms before accepting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Access your proposals via the link provided in your email.
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-2">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              Track the status of your orders and scheduled services. See
              what&apos;s completed and what&apos;s coming up.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Access your orders via the link provided in your email.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Test Links Section */}
      <section className="rounded-lg border border-border bg-muted/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-4">
          Development Links
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href={`/orders/${TEST_ORDER_ID}`}>
              View Test Order
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="flex items-center text-sm text-muted-foreground">
            Order ID: <code className="ml-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{TEST_ORDER_ID}</code>
          </p>
        </div>
      </section>

      {/* Support Section */}
      <section className="text-center py-4">
        <p className="text-muted-foreground">
          Need help? Contact us at{" "}
          <a
            href="mailto:support@serviceengine.xyz"
            className="font-medium text-primary hover:underline"
          >
            support@serviceengine.xyz
          </a>
        </p>
      </section>
    </div>
  );
}
