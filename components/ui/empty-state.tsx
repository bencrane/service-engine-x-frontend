import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly icon?: React.ReactNode;
  readonly action?: {
    readonly label: string;
    readonly href: string;
  };
  readonly className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-8 py-12 text-center",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        {icon ?? <FileQuestion className="h-6 w-6 text-muted-foreground" />}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action && (
        <Button asChild className="mt-8">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
