import { Suspense } from "react";
import { headers } from "next/headers";
import { Briefcase } from "lucide-react";
import {
  fetchEngagements,
  fetchProjects,
  fetchConversations,
  ApiError,
} from "@/lib/api";
import { getBrandingFromDomain } from "@/lib/branding";
import { ProjectCard, PhaseProgressLabeled } from "@/components/features/project-card";
import {
  OnboardingSection,
  WelcomeBanner,
} from "@/components/features/onboarding-section";
import { DashboardSkeleton } from "@/components/features/dashboard-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  // Get branding from request headers
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const branding = getBrandingFromDomain(host);

  let engagements: ReadonlyArray<Engagement> = [];
  let projects: ReadonlyArray<Project> = [];
  let conversations: ReadonlyArray<Conversation> = [];
  let error: string | null = null;

  try {
    // Fetch engagements, projects, and conversations in parallel
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

  // Get the active engagement (first non-closed)
  const activeEngagement = engagements.find(
    (e) => e.status.toLowerCase() !== "closed"
  );

  // Get active projects (not completed)
  const activeProjects = projects.filter(
    (p) => p.status.toLowerCase() !== "completed"
  );

  // No engagement or projects - workspace is being set up
  if (!activeEngagement && activeProjects.length === 0) {
    return (
      <div className="space-y-8">
        <WelcomeBanner brandingName={branding.name} />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Briefcase className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Your workspace is being prepared
          </h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            We're setting up your project. You'll see your dashboard here once
            everything is ready.
          </p>
        </div>
      </div>
    );
  }

  // Get client name from engagement
  const clientName = activeEngagement?.client?.name;

  // Get messages from conversations for activity feed
  const recentMessages: Message[] = conversations
    .flatMap((c) => c.messages ?? [])
    .filter((m) => !m.isInternal)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <WelcomeBanner
        brandingName={branding.name}
        clientName={clientName}
        engagementName={activeEngagement?.name}
      />

      {/* Onboarding Section for new clients or active next steps */}
      {activeEngagement && activeProjects.length > 0 && (
        <OnboardingSection
          engagement={activeEngagement}
          projects={activeProjects}
        />
      )}

      {/* Projects Section */}
      {activeProjects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            {activeProjects.length === 1 ? "Your Project" : "Your Projects"}
          </h2>

          {activeProjects.length === 1 && activeProjects[0] ? (
            // Single project - show detailed view
            <SingleProjectView project={activeProjects[0]} />
          ) : (
            // Multiple projects - show cards
            <div className="grid gap-4 md:grid-cols-2">
              {activeProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  href={`/projects/${project.id}`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Activity Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <span className="text-xs font-medium">
                        {message.sender?.name?.charAt(0) ?? "?"}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          {message.sender?.name ?? "Team"}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent activity. Messages and updates will appear here.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Conversations Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            {conversations.length > 0 ? (
              <div className="space-y-3">
                {conversations.slice(0, 5).map((conversation) => (
                  <div
                    key={conversation.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {conversation.subject ?? conversation.project?.name ?? "Conversation"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {conversation.messageCount} message
                        {conversation.messageCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    {conversation.lastMessageAt && (
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(conversation.lastMessageAt)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No conversations yet. Start a conversation about your project.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface SingleProjectViewProps {
  readonly project: Project;
}

function SingleProjectView({ project }: SingleProjectViewProps) {
  const currentPhase = PROJECT_PHASES.find((p) => p.id === project.phaseId);

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {project.name}
            </h3>
            {project.description && (
              <p className="mt-1 text-muted-foreground">{project.description}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Progress
            </span>
            <span className="text-sm font-medium text-foreground">
              {currentPhase?.label} Phase
            </span>
          </div>
          <PhaseProgressLabeled phaseId={project.phaseId} />
        </div>

        <div className="grid gap-4 pt-2 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium text-foreground">{project.status}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Started</p>
            <p className="font-medium text-foreground">
              {new Date(project.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          {project.service && (
            <div>
              <p className="text-sm text-muted-foreground">Service</p>
              <p className="font-medium text-foreground">
                {project.service.name}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

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
