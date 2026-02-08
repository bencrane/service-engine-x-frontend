import { MessageSquare, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderMessage, OrderTask } from "@/types";

interface ActivityItem {
  readonly id: string;
  readonly type: "message" | "task_completed" | "status_update";
  readonly title: string;
  readonly description?: string;
  readonly timestamp: string;
  readonly icon: React.ReactNode;
}

interface ActivityFeedProps {
  readonly messages?: ReadonlyArray<OrderMessage>;
  readonly tasks?: ReadonlyArray<OrderTask>;
  readonly limit?: number;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function ActivityFeed({
  messages = [],
  tasks = [],
  limit = 5,
}: ActivityFeedProps) {
  const activities: ActivityItem[] = [];

  // Add public messages
  messages
    .filter((m) => !m.isInternal)
    .forEach((message) => {
      activities.push({
        id: `msg-${message.id}`,
        type: "message",
        title: `Message from ${message.sender}`,
        description:
          message.content.length > 80
            ? message.content.slice(0, 80) + "..."
            : message.content,
        timestamp: message.createdAt,
        icon: <MessageSquare className="h-4 w-4" />,
      });
    });

  // Add completed tasks
  tasks
    .filter((t) => t.status.toLowerCase() === "completed" && t.completedAt)
    .forEach((task) => {
      activities.push({
        id: `task-${task.id}`,
        type: "task_completed",
        title: "Task completed",
        description: task.title,
        timestamp: task.completedAt!,
        icon: <CheckCircle className="h-4 w-4" />,
      });
    });

  // Sort by timestamp descending and limit
  const sortedActivities = activities
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, limit);

  if (sortedActivities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No recent activity to show.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedActivities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                {activity.icon}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(activity.timestamp)}
                  </div>
                </div>
                {activity.description && (
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
