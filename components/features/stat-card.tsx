import { cn } from "@/lib/utils";

interface StatCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly description?: string;
  readonly className?: string;
}

export function StatCard({ title, value, description, className }: StatCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-6", className)}>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-foreground">
        {value}
      </p>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
