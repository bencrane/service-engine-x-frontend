import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import { PROJECT_PHASES } from "@/types";
import type { Project, ProjectSummary } from "@/types";

interface ProjectCardProps {
  readonly project: Project | ProjectSummary;
  readonly href?: string;
}

export function ProjectCard({ project, href }: ProjectCardProps) {
  const content = (
    <Card className="group border-border bg-card transition-colors hover:border-primary/50">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-foreground">{project.name}</h3>
              <StatusBadge status={project.status} />
            </div>

            <PhaseProgress phaseId={project.phaseId} />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {project.phase}
              </span>
              <span>phase</span>
            </div>
          </div>

          {href && (
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

interface PhaseProgressProps {
  readonly phaseId: number;
}

export function PhaseProgress({ phaseId }: PhaseProgressProps) {
  return (
    <div className="flex items-center gap-1">
      {PROJECT_PHASES.map((phase, index) => {
        const isCompleted = phase.id < phaseId;
        const isCurrent = phase.id === phaseId;
        const isUpcoming = phase.id > phaseId;

        return (
          <div key={phase.id} className="flex items-center">
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors",
                isCompleted && "bg-primary text-primary-foreground",
                isCurrent && "border-2 border-primary bg-background text-primary",
                isUpcoming && "border border-border bg-muted text-muted-foreground"
              )}
              title={phase.label}
            >
              {isCompleted ? (
                <Check className="h-3 w-3" />
              ) : (
                <span>{phase.id}</span>
              )}
            </div>
            {index < PROJECT_PHASES.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-4",
                  phase.id < phaseId ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface PhaseProgressLabeledProps {
  readonly phaseId: number;
  readonly showLabels?: boolean;
}

export function PhaseProgressLabeled({
  phaseId,
  showLabels = true,
}: PhaseProgressLabeledProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {PROJECT_PHASES.map((phase, index) => {
          const isCompleted = phase.id < phaseId;
          const isCurrent = phase.id === phaseId;
          const isUpcoming = phase.id > phaseId;

          return (
            <div key={phase.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent &&
                      "border-2 border-primary bg-background text-primary",
                    isUpcoming &&
                      "border border-border bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : phase.id}
                </div>
                {showLabels && (
                  <span
                    className={cn(
                      "mt-1 text-xs",
                      isCurrent
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {phase.label}
                  </span>
                )}
              </div>
              {index < PROJECT_PHASES.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-0.5 flex-1",
                    phase.id < phaseId ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
