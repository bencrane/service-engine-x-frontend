import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Phase {
  readonly name: string;
  readonly status: "completed" | "current" | "upcoming";
}

interface ProjectProgressProps {
  readonly phases: ReadonlyArray<Phase>;
}

export function ProjectProgress({ phases }: ProjectProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {phases.map((phase, index) => (
        <div key={phase.name} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full",
                phase.status === "completed" &&
                  "bg-primary text-primary-foreground",
                phase.status === "current" &&
                  "border-2 border-primary bg-background",
                phase.status === "upcoming" && "border border-border bg-muted"
              )}
            >
              {phase.status === "completed" ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Circle
                  className={cn(
                    "h-2 w-2",
                    phase.status === "current"
                      ? "fill-primary text-primary"
                      : "fill-muted-foreground/50 text-muted-foreground/50"
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "text-sm",
                phase.status === "current"
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {phase.name}
            </span>
          </div>
          {index < phases.length - 1 && (
            <div
              className={cn(
                "mx-3 h-px w-8",
                phases[index + 1]?.status === "upcoming"
                  ? "bg-border"
                  : "bg-primary"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function getProjectPhases(
  status: string
): ReadonlyArray<Phase> {
  const statusLower = status.toLowerCase();

  if (statusLower === "completed") {
    return [
      { name: "Setup", status: "completed" },
      { name: "In Progress", status: "completed" },
      { name: "Review", status: "completed" },
      { name: "Delivered", status: "completed" },
    ];
  }

  if (statusLower === "in_progress" || statusLower === "active") {
    return [
      { name: "Setup", status: "completed" },
      { name: "In Progress", status: "current" },
      { name: "Review", status: "upcoming" },
      { name: "Delivered", status: "upcoming" },
    ];
  }

  if (statusLower === "confirmed") {
    return [
      { name: "Setup", status: "current" },
      { name: "In Progress", status: "upcoming" },
      { name: "Review", status: "upcoming" },
      { name: "Delivered", status: "upcoming" },
    ];
  }

  // pending or other
  return [
    { name: "Setup", status: "upcoming" },
    { name: "In Progress", status: "upcoming" },
    { name: "Review", status: "upcoming" },
    { name: "Delivered", status: "upcoming" },
  ];
}
