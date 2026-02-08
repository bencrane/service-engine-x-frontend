import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export function Section({ title, children, className }: SectionProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card", className)}>
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

interface SectionListProps {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export function SectionList({ title, children, className }: SectionListProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card overflow-hidden", className)}>
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </h2>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

interface SectionListItemProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

export function SectionListItem({ children, className }: SectionListItemProps) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}
