import { Suspense } from "react";
import { Briefcase } from "lucide-react";
import { fetchOrders, ApiError } from "@/lib/api";
import { ActiveProjectCard } from "@/components/features/active-project-card";
import {
  ActionableTaskList,
  EmptyTaskList,
} from "@/components/features/actionable-task-list";
import { ActivityFeed } from "@/components/features/activity-feed";
import {
  NextStepsSection,
  getNextSteps,
} from "@/components/features/next-steps-section";
import { DashboardSkeleton } from "@/components/features/dashboard-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
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
      error = "Failed to load project data";
    }
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to load project"
        description={error}
        action={{ label: "Try again", href: "/" }}
      />
    );
  }

  // Find the active project (first non-completed order)
  const activeProject = orders.find(
    (o) => !["completed", "cancelled"].includes(o.status.toLowerCase())
  );

  if (!activeProject) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Briefcase className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          No active project
        </h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          You don't have any active projects at the moment. When you start a new
          project, it will appear here.
        </p>
      </div>
    );
  }

  const nextSteps = getNextSteps(activeProject.status);

  return (
    <div className="space-y-8">
      {/* Active Project Hero */}
      <ActiveProjectCard order={activeProject} />

      {/* Actionable Tasks */}
      {activeProject.tasks && activeProject.tasks.length > 0 ? (
        <ActionableTaskList
          tasks={activeProject.tasks}
          orderId={activeProject.id}
        />
      ) : (
        <EmptyTaskList />
      )}

      {/* Activity Feed and Next Steps */}
      <div className="grid gap-6 md:grid-cols-2">
        <ActivityFeed
          messages={activeProject.messages}
          tasks={activeProject.tasks}
        />
        <NextStepsSection steps={nextSteps} />
      </div>
    </div>
  );
}
