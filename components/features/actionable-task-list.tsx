import Link from "next/link";
import { ArrowRight, FileText, CheckCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { OrderTask } from "@/types";

interface ActionableTask {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly actionLabel: string;
  readonly actionHref: string;
  readonly icon: React.ReactNode;
}

interface ActionableTaskListProps {
  readonly tasks: ReadonlyArray<OrderTask>;
  readonly orderId: string;
}

function inferTaskAction(task: OrderTask, orderId: string): ActionableTask {
  const titleLower = task.title.toLowerCase();

  // Determine action type based on title keywords
  if (
    titleLower.includes("form") ||
    titleLower.includes("intake") ||
    titleLower.includes("complete")
  ) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      actionLabel: "Start",
      actionHref: `/orders/${orderId}/tasks/${task.id}`,
      icon: <FileText className="h-4 w-4" />,
    };
  }

  if (
    titleLower.includes("review") ||
    titleLower.includes("sample") ||
    titleLower.includes("check")
  ) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      actionLabel: "Review",
      actionHref: `/orders/${orderId}/tasks/${task.id}`,
      icon: <Eye className="h-4 w-4" />,
    };
  }

  if (
    titleLower.includes("approve") ||
    titleLower.includes("confirm") ||
    titleLower.includes("sign")
  ) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      actionLabel: "Approve",
      actionHref: `/orders/${orderId}/tasks/${task.id}`,
      icon: <CheckCircle className="h-4 w-4" />,
    };
  }

  // Default action
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    actionLabel: "View",
    actionHref: `/orders/${orderId}/tasks/${task.id}`,
    icon: <FileText className="h-4 w-4" />,
  };
}

export function ActionableTaskList({
  tasks,
  orderId,
}: ActionableTaskListProps) {
  const pendingTasks = tasks.filter(
    (t) => t.status.toLowerCase() !== "completed"
  );

  if (pendingTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No pending tasks. You're all caught up!
          </p>
        </CardContent>
      </Card>
    );
  }

  const actionableTasks = pendingTasks.map((task) =>
    inferTaskAction(task, orderId)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actionableTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {task.icon}
              </div>
              <div>
                <p className="font-medium text-foreground">{task.title}</p>
                {task.description && (
                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={task.actionHref}>
                {task.actionLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface EmptyTaskListProps {
  readonly message?: string;
}

export function EmptyTaskList({ message }: EmptyTaskListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {message ?? "No pending tasks. You're all caught up!"}
        </p>
      </CardContent>
    </Card>
  );
}
