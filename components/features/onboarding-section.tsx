import Link from "next/link";
import {
  Sparkles,
  Calendar,
  FileText,
  CheckCircle,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Project, ProjectSummary, Engagement } from "@/types";

interface OnboardingSectionProps {
  readonly engagement: Engagement;
  readonly projects: ReadonlyArray<Project | ProjectSummary>;
}

interface NextAction {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly buttonLabel: string;
  readonly icon: React.ReactNode;
  readonly priority: "primary" | "secondary";
}

function getNextActionsForPhase(
  phaseId: number,
  projectId: string
): ReadonlyArray<NextAction> {
  switch (phaseId) {
    case 1: // Kickoff
      return [
        {
          title: "Schedule kickoff meeting",
          description:
            "Let's set up a time to discuss your project goals and timeline.",
          href: `/projects/${projectId}`,
          buttonLabel: "Schedule",
          icon: <Calendar className="h-5 w-5" />,
          priority: "primary",
        },
        {
          title: "Review project scope",
          description: "Take a look at what we'll be working on together.",
          href: `/projects/${projectId}`,
          buttonLabel: "View details",
          icon: <FileText className="h-5 w-5" />,
          priority: "secondary",
        },
      ];
    case 2: // Setup
      return [
        {
          title: "Complete intake form",
          description:
            "Provide the information we need to get started on your project.",
          href: `/projects/${projectId}/tasks`,
          buttonLabel: "Start form",
          icon: <FileText className="h-5 w-5" />,
          priority: "primary",
        },
        {
          title: "Provide access credentials",
          description: "Share the access we need to your systems securely.",
          href: `/projects/${projectId}`,
          buttonLabel: "Add credentials",
          icon: <CheckCircle className="h-5 w-5" />,
          priority: "secondary",
        },
      ];
    case 3: // Build
      return [
        {
          title: "We're working on your deliverables",
          description:
            "Our team is actively building your solution. We'll update you on progress.",
          href: `/projects/${projectId}`,
          buttonLabel: "View progress",
          icon: <Sparkles className="h-5 w-5" />,
          priority: "primary",
        },
        {
          title: "Have questions?",
          description: "Send us a message if you need anything.",
          href: "/messages",
          buttonLabel: "Message us",
          icon: <MessageSquare className="h-5 w-5" />,
          priority: "secondary",
        },
      ];
    case 4: // Testing
      return [
        {
          title: "Review sample data",
          description:
            "Take a look at the sample output and let us know if it meets your expectations.",
          href: `/projects/${projectId}/tasks`,
          buttonLabel: "Review now",
          icon: <FileText className="h-5 w-5" />,
          priority: "primary",
        },
        {
          title: "Provide feedback",
          description: "Let us know what adjustments you'd like us to make.",
          href: "/messages",
          buttonLabel: "Send feedback",
          icon: <MessageSquare className="h-5 w-5" />,
          priority: "secondary",
        },
      ];
    case 5: // Deployment
      return [
        {
          title: "Final approval needed",
          description:
            "Review the completed work and approve it for final delivery.",
          href: `/projects/${projectId}/tasks`,
          buttonLabel: "Approve",
          icon: <CheckCircle className="h-5 w-5" />,
          priority: "primary",
        },
      ];
    case 6: // Handoff
      return [
        {
          title: "Training scheduled",
          description:
            "We'll walk you through everything you need to know about your deliverables.",
          href: `/projects/${projectId}`,
          buttonLabel: "View schedule",
          icon: <Calendar className="h-5 w-5" />,
          priority: "primary",
        },
        {
          title: "Access your deliverables",
          description: "Download your completed files and documentation.",
          href: `/projects/${projectId}`,
          buttonLabel: "Download",
          icon: <FileText className="h-5 w-5" />,
          priority: "secondary",
        },
      ];
    default:
      return [];
  }
}

export function OnboardingSection({
  engagement: _engagement,
  projects,
}: OnboardingSectionProps) {
  const isNewEngagement =
    projects.length > 0 && projects.every((p) => p.phaseId === 1);
  const activeProject = projects.find((p) => p.phaseId <= 6);

  if (!activeProject) {
    return null;
  }

  const nextActions = getNextActionsForPhase(activeProject.phaseId, activeProject.id);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">
              {isNewEngagement
                ? "Welcome to your project workspace"
                : "What's next"}
            </CardTitle>
            {isNewEngagement && (
              <p className="text-sm text-muted-foreground">
                Here's what you need to do to get started
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {nextActions.map((action, index) => (
          <div
            key={index}
            className={`flex items-center justify-between gap-4 rounded-lg border p-4 ${
              action.priority === "primary"
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-muted/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  action.priority === "primary"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {action.icon}
              </div>
              <div>
                <h4 className="font-medium text-foreground">{action.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </div>
            <Button
              variant={action.priority === "primary" ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={action.href}>
                {action.buttonLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface WelcomeBannerProps {
  readonly brandingName?: string;
  readonly clientName?: string;
  readonly engagementName?: string;
}

export function WelcomeBanner({
  brandingName,
  clientName,
  engagementName,
}: WelcomeBannerProps) {
  const greeting = clientName
    ? `Welcome, ${clientName}`
    : brandingName
      ? `Welcome to ${brandingName}`
      : "Welcome to your workspace";

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {greeting}
      </h1>
      {engagementName && (
        <p className="text-muted-foreground">
          You're viewing the <span className="font-medium">{engagementName}</span> engagement
        </p>
      )}
    </div>
  );
}
