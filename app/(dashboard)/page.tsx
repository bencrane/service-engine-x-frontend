import { Suspense } from "react";
import { Briefcase, Calendar, FileText, MessageSquare } from "lucide-react";
import {
  fetchEngagements,
  fetchProjects,
  fetchConversations,
  ApiError,
} from "@/lib/api";
import { DashboardSkeleton } from "@/components/features/dashboard-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { PROJECT_PHASES } from "@/types";
import type { Engagement, Project, Conversation, Message } from "@/types";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  let engagements: ReadonlyArray<Engagement> = [];
  let projects: ReadonlyArray<Project> = [];
  let conversations: ReadonlyArray<Conversation> = [];
  let error: string | null = null;

  try {
    const [engagementsResult, projectsResult, conversationsResult] =
      await Promise.all([
        fetchEngagements().catch(() => [] as Engagement[]),
        fetchProjects().catch(() => [] as Project[]),
        fetchConversations().catch(() => [] as Conversation[]),
      ]);
    engagements = engagementsResult;
    projects = projectsResult;
    conversations = conversationsResult;
  } catch (err) {
    if (err instanceof ApiError) {
      error = err.message;
    } else {
      error = "Failed to load workspace data";
    }
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to load workspace"
        description={error}
        action={{ label: "Try again", href: "/" }}
      />
    );
  }

  // Get the active engagement
  const activeEngagement = engagements.find(
    (e) => e.status.toLowerCase() !== "closed"
  );

  // Get active projects
  const activeProjects = projects.filter(
    (p) => p.status.toLowerCase() !== "completed"
  );

  // No engagement or projects - workspace being set up
  if (!activeEngagement && activeProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Briefcase className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">
          Your workspace is being prepared
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          We're setting up your project. You'll see your dashboard here once
          everything is ready.
        </p>
      </div>
    );
  }

  // Get client name and engagement details
  const clientName = activeEngagement?.client?.name;
  const engagementName = activeEngagement?.name;

  // Get messages for activity
  const recentMessages: Message[] = conversations
    .flatMap((c) => c.messages ?? [])
    .filter((m) => !m.isInternal)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // Get current project for next steps
  const currentProject = activeProjects[0];
  const currentPhase = currentProject
    ? PROJECT_PHASES.find((p) => p.id === currentProject.phaseId)
    : null;

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <header>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome{clientName ? `, ${clientName.split(" ")[0]}` : ""}
        </h1>
        {engagementName && (
          <p className="mt-2 text-lg text-foreground">
            {engagementName}
          </p>
        )}
      </header>

      {/* Projects Section */}
      {activeProjects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {activeProjects.length === 1 ? "Your Project" : "Your Projects"}
          </h2>

          <div className="space-y-4">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Next Steps - Dynamic based on phase */}
      {currentProject && currentPhase && (
        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Next Steps
          </h2>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {getPhaseActions(currentPhase.name).map((action, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      {action.icon}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {action.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Messages - Only show if there are messages */}
      {recentMessages.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Recent Messages
          </h2>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <span className="text-sm font-medium">
                        {message.sender?.name?.charAt(0) ?? "?"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-foreground">
                          {message.sender?.name ?? "Team"}
                        </p>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatRelativeTime(message.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

// =============================================================================
// Project Card Component
// =============================================================================

interface ProjectCardProps {
  readonly project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const currentPhase = PROJECT_PHASES.find((p) => p.id === project.phaseId);
  const completedPhases = project.phaseId - 1;
  const totalPhases = PROJECT_PHASES.length;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold text-foreground">
              {project.name}
            </h3>
            {project.description && (
              <p className="mt-1 text-muted-foreground">{project.description}</p>
            )}
          </div>
          {project.service && (
            <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {project.service.name}
            </span>
          )}
        </div>

        {/* Phase Progress */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {currentPhase?.label} Phase
            </span>
            <span className="text-sm text-muted-foreground">
              {completedPhases} of {totalPhases} phases complete
            </span>
          </div>

          {/* Progress Bar with Labels */}
          <div className="space-y-2">
            <div className="flex h-2 overflow-hidden rounded-full bg-muted">
              {PROJECT_PHASES.map((phase, index) => (
                <div
                  key={phase.id}
                  className={`flex-1 ${
                    index < project.phaseId
                      ? "bg-primary"
                      : "bg-transparent"
                  } ${index > 0 ? "border-l border-background" : ""}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Kickoff</span>
              <span>Handoff</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Phase-specific Actions
// =============================================================================

interface PhaseAction {
  readonly title: string;
  readonly description: string;
  readonly icon: React.ReactNode;
}

function getPhaseActions(phase: string): ReadonlyArray<PhaseAction> {
  switch (phase) {
    case "kickoff":
      return [
        {
          title: "Schedule kickoff meeting",
          description: "Let's set up a time to discuss your project goals and timeline.",
          icon: <Calendar className="h-5 w-5 text-muted-foreground" />,
        },
        {
          title: "Review project scope",
          description: "Take a look at what we'll be working on together.",
          icon: <FileText className="h-5 w-5 text-muted-foreground" />,
        },
      ];
    case "setup":
      return [
        {
          title: "Provide access credentials",
          description: "Share the logins and permissions we need to get started.",
          icon: <FileText className="h-5 w-5 text-muted-foreground" />,
        },
        {
          title: "Review initial configuration",
          description: "Check the setup we've prepared for your systems.",
          icon: <FileText className="h-5 w-5 text-muted-foreground" />,
        },
      ];
    case "build":
      return [
        {
          title: "Review progress updates",
          description: "Check in on what we've built so far.",
          icon: <FileText className="h-5 w-5 text-muted-foreground" />,
        },
        {
          title: "Provide feedback",
          description: "Let us know if anything needs adjustment.",
          icon: <MessageSquare className="h-5 w-5 text-muted-foreground" />,
        },
      ];
    case "testing":
      return [
        {
          title: "Test the deliverables",
          description: "Try out what we've built and let us know how it works.",
          icon: <FileText className="h-5 w-5 text-muted-foreground" />,
        },
        {
          title: "Report any issues",
          description: "Share any bugs or concerns you find during testing.",
          icon: <MessageSquare className="h-5 w-5 text-muted-foreground" />,
        },
      ];
    case "deployment":
      return [
        {
          title: "Approve for launch",
          description: "Give us the green light to deploy to production.",
          icon: <FileText className="h-5 w-5 text-muted-foreground" />,
        },
        {
          title: "Coordinate launch timing",
          description: "Let us know the best time to go live.",
          icon: <Calendar className="h-5 w-5 text-muted-foreground" />,
        },
      ];
    case "handoff":
      return [
        {
          title: "Review documentation",
          description: "Check the guides and documentation we've prepared.",
          icon: <FileText className="h-5 w-5 text-muted-foreground" />,
        },
        {
          title: "Schedule training session",
          description: "Let's walk through everything before we wrap up.",
          icon: <Calendar className="h-5 w-5 text-muted-foreground" />,
        },
      ];
    default:
      return [
        {
          title: "Check for updates",
          description: "We'll post next steps here as your project progresses.",
          icon: <FileText className="h-5 w-5 text-muted-foreground" />,
        },
      ];
  }
}

// =============================================================================
// Utilities
// =============================================================================

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
