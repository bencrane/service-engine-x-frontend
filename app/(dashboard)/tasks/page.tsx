import { ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function TasksPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Tasks
        </h1>
        <p className="text-muted-foreground">
          Forms to complete and items requiring your attention
        </p>
      </div>

      <EmptyState
        title="No pending tasks"
        description="When your service provider needs information from you—like intake forms or approvals—they'll appear here."
        icon={<ClipboardList className="h-6 w-6 text-muted-foreground" />}
      />
    </div>
  );
}
