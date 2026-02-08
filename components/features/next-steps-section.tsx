import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface NextStep {
  readonly title: string;
  readonly description?: string;
  readonly status: "completed" | "current" | "upcoming";
}

interface NextStepsSectionProps {
  readonly steps: ReadonlyArray<NextStep>;
}

export function NextStepsSection({ steps }: NextStepsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Next Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm",
                    step.status === "completed" &&
                      "bg-primary text-primary-foreground",
                    step.status === "current" &&
                      "border-2 border-primary bg-background text-primary",
                    step.status === "upcoming" &&
                      "border border-border bg-muted text-muted-foreground"
                  )}
                >
                  {step.status === "completed" ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "mt-2 h-8 w-px",
                      step.status === "completed" ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
              <div className="pb-4">
                <p
                  className={cn(
                    "font-medium",
                    step.status === "current"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

export function getNextSteps(
  status: string
): ReadonlyArray<NextStep> {
  const statusLower = status.toLowerCase();

  if (statusLower === "completed") {
    return [
      { title: "Data cleaning", status: "completed" },
      { title: "Quality review", status: "completed" },
      { title: "Final delivery", status: "completed" },
    ];
  }

  if (statusLower === "in_progress" || statusLower === "active") {
    return [
      {
        title: "Data cleaning",
        description: "Processing your data according to specifications",
        status: "current",
      },
      {
        title: "Quality review",
        description: "We'll review the results for accuracy",
        status: "upcoming",
      },
      {
        title: "Final delivery",
        description: "You'll receive the completed work",
        status: "upcoming",
      },
    ];
  }

  if (statusLower === "confirmed") {
    return [
      {
        title: "Project setup",
        description: "We're preparing your project",
        status: "current",
      },
      {
        title: "Data cleaning",
        description: "Processing your data according to specifications",
        status: "upcoming",
      },
      {
        title: "Quality review",
        description: "We'll review the results for accuracy",
        status: "upcoming",
      },
      {
        title: "Final delivery",
        description: "You'll receive the completed work",
        status: "upcoming",
      },
    ];
  }

  // pending or other
  return [
    {
      title: "Order confirmation",
      description: "Waiting for order to be confirmed",
      status: "current",
    },
    {
      title: "Project setup",
      description: "We'll prepare your project",
      status: "upcoming",
    },
    {
      title: "Data cleaning",
      description: "Processing your data according to specifications",
      status: "upcoming",
    },
    {
      title: "Final delivery",
      description: "You'll receive the completed work",
      status: "upcoming",
    },
  ];
}
