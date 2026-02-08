import { SectionList, SectionListItem } from "@/components/ui/section";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import type { OrderTask } from "@/types";

interface TaskListProps {
  readonly tasks: ReadonlyArray<OrderTask>;
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <SectionList title="Tasks">
      {tasks.map((task) => (
        <SectionListItem key={task.id}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-1">
              <h3 className="font-medium text-foreground">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-muted-foreground">{task.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {task.dueDate && <span>Due: {formatDate(task.dueDate)}</span>}
                {task.completedAt && (
                  <span>Completed: {formatDate(task.completedAt)}</span>
                )}
              </div>
            </div>
            <StatusBadge status={task.status} />
          </div>
        </SectionListItem>
      ))}
    </SectionList>
  );
}
