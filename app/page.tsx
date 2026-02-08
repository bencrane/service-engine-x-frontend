import { Suspense } from "react";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import { fetchOrders, ApiError } from "@/lib/api";
import { OrdersTable } from "@/components/features/orders-table";
import { StatCard } from "@/components/features/stat-card";
import { DashboardSkeleton } from "@/components/features/dashboard-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  let orders: ReadonlyArray<Order> = [];
  let error: string | null = null;

  try {
    orders = await fetchOrders();
  } catch (err) {
    if (err instanceof ApiError) {
      error = err.message;
    } else {
      error = "Failed to load orders";
    }
  }

  if (error) {
    return (
      <div className="space-y-8">
        <DashboardHeader />
        <EmptyState
          title="Unable to load orders"
          description={error}
          action={{ label: "Try again", href: "/" }}
        />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-8">
        <DashboardHeader />
        <EmptyState
          title="No orders yet"
          description="Orders will appear here once you purchase a service. Check your proposals to get started."
          icon={<Package className="h-6 w-6 text-muted-foreground" />}
        />
      </div>
    );
  }

  const activeOrders = orders.filter(
    (o) => !["completed", "cancelled"].includes(o.status.toLowerCase())
  );
  const completedOrders = orders.filter(
    (o) => o.status.toLowerCase() === "completed"
  );

  return (
    <div className="space-y-8">
      <DashboardHeader orderCount={orders.length} />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Active Orders"
          value={activeOrders.length}
          description="In progress"
        />
        <StatCard
          title="Completed"
          value={completedOrders.length}
          description="All time"
        />
        <StatCard
          title="Total Orders"
          value={orders.length}
          description="All time"
        />
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Active Orders
            </h2>
            {activeOrders.length > 5 && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/orders">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
          <OrdersTable orders={activeOrders.slice(0, 5)} />
        </section>
      )}

      {/* Recent Completed */}
      {completedOrders.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Recently Completed
            </h2>
          </div>
          <OrdersTable orders={completedOrders.slice(0, 3)} />
        </section>
      )}

      {/* All Orders (if only completed exist) */}
      {activeOrders.length === 0 && completedOrders.length === 0 && orders.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Your Orders</h2>
          <OrdersTable orders={orders} />
        </section>
      )}
    </div>
  );
}

interface DashboardHeaderProps {
  readonly orderCount?: number;
}

function DashboardHeader({ orderCount }: DashboardHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Dashboard
      </h1>
      <p className="text-muted-foreground">
        {orderCount !== undefined && orderCount > 0
          ? `You have ${orderCount} order${orderCount === 1 ? "" : "s"}`
          : "Welcome to your customer portal"}
      </p>
    </div>
  );
}
