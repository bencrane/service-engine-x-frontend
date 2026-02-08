import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProjectProgress, getProjectPhases } from "./project-progress";
import type { Order } from "@/types";

interface ActiveProjectCardProps {
  readonly order: Order;
}

export function ActiveProjectCard({ order }: ActiveProjectCardProps) {
  const phases = getProjectPhases(order.status);
  const startDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Active Project
            </p>
            <h2 className="text-2xl font-semibold text-foreground">
              {order.service ?? "Service Project"}
            </h2>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {startDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Started {startDate}</span>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Progress</p>
          <ProjectProgress phases={phases} />
        </div>
      </CardContent>
    </Card>
  );
}
