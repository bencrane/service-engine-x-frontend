import { Suspense } from "react";
import Link from "next/link";
import {
  Briefcase,
  FolderKanban,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
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
import type { Engagement, Project, Conversation } from "@/types";

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

  const activeEngagement = engagements.find(
    (e) => e.status.toLowerCase() !== "closed"
  );
  const activeProjects = projects.filter(
    (p) => p.status.toLowerCase() !== "completed"
  );
  const completedProjects = projects.filter(
    (p) => p.status.toLowerCase() === "completed"
  );

  // Empty state
  if (!activeEngagement && activeProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Briefcase className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">
          Your workspace is being prepared
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          We're setting up your project. You'll see your dashboard here once
          everything is ready.
        </p>
      </div>
    );
  }

  const clientName = activeEngagement?.client?.name;
  const engagementName = activeEngagement?.name;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {clientName ? `Welcome back, ${clientName.split(" ")[0]}` : "Dashboard"}
        </h1>
        {engagementName && (
          <p className="mt-1 text-muted-foreground">{engagementName}</p>
        )}
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Active Projects"
          value={activeProjects.length}
          href="/projects"
        />
        <StatCard
          label="Completed"
          value={completedProjects.length}
          href="/projects"
        />
        <StatCard
          label="Conversations"
          value={conversations.length}
          href="/conversations"
        />
      </div>

      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Active Projects
            </h2>
            <Link
              href="/projects"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {activeProjects.slice(0, 3).map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Conversations */}
      {conversations.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Recent Conversations
            </h2>
            <Link
              href="/conversations"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {conversations.slice(0, 3).map((conversation) => (
                  <ConversationRow
                    key={conversation.id}
                    conversation={conversation}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Empty state for conversations */}
      {conversations.length === 0 && activeProjects.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            Conversations
          </h2>
          <Card>
            <CardContent className="flex items-center gap-4 py-8">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  No conversations yet. Your team will start one when there are updates.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

// =============================================================================
// Components
// =============================================================================

interface StatCardProps {
  readonly label: string;
  readonly value: number;
  readonly href: string;
}

function StatCard({ label, value, href }: StatCardProps) {
  return (
    <Link href={href}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

interface ProjectRowProps {
  readonly project: Project;
}

function ProjectRow({ project }: ProjectRowProps) {
  const currentPhase = PROJECT_PHASES.find((p) => p.id === project.phaseId);

  return (
    <Card className="transition-colors hover:bg-accent/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <FolderKanban className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground">{project.name}</p>
            <p className="text-sm text-muted-foreground">
              {currentPhase?.label} · Phase {project.phaseId} of 6
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="flex h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              {PROJECT_PHASES.map((phase, index) => (
                <div
                  key={phase.id}
                  className={`flex-1 ${
                    index < project.phaseId ? "bg-primary" : "bg-transparent"
                  } ${index > 0 ? "ml-0.5" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ConversationRowProps {
  readonly conversation: Conversation;
}

function ConversationRow({ conversation }: ConversationRowProps) {
  return (
    <div className="flex items-center gap-4 p-4 transition-colors hover:bg-accent/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
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
