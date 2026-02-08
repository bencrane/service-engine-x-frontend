import { Suspense } from "react";
import Link from "next/link";
import { MessageSquare, ArrowRight, Plus } from "lucide-react";
import { fetchConversations, fetchProjects, ApiError } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { Conversation, Project } from "@/types";

export default function MessagesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Messages
          </h1>
          <p className="text-muted-foreground">
            Communicate with your service team
          </p>
        </div>
      </div>

      <Suspense fallback={<MessagesPageSkeleton />}>
        <MessagesContent />
      </Suspense>
    </div>
  );
}

async function MessagesContent() {
  let conversations: ReadonlyArray<Conversation> = [];
  let projects: ReadonlyArray<Project> = [];
  let error: string | null = null;

  try {
    const [conversationsResult, projectsResult] = await Promise.all([
      fetchConversations().catch(() => [] as Conversation[]),
      fetchProjects().catch(() => [] as Project[]),
    ]);
    conversations = conversationsResult;
    projects = projectsResult;
  } catch (err) {
    if (err instanceof ApiError) {
      error = err.message;
    } else {
      error = "Failed to load messages";
    }
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to load messages"
        description={error}
        action={{ label: "Try again", href: "/messages" }}
      />
    );
  }

  if (conversations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            No conversations yet
          </h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            {projects.length > 0
              ? "Start a conversation about your project. We're here to help."
              : "Messages from your service provider will appear here."}
          </p>
          {projects.length > 0 && projects[0] && (
            <Button className="mt-6" asChild>
              <Link href={`/projects/${projects[0].id}`}>
                <Plus className="mr-2 h-4 w-4" />
                Start a conversation
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Group conversations by project
  const conversationsByProject = new Map<string, Conversation[]>();
  const projectsById = new Map(projects.map((p) => [p.id, p]));

  for (const conversation of conversations) {
    const projectId = conversation.projectId;
    if (!conversationsByProject.has(projectId)) {
      conversationsByProject.set(projectId, []);
    }
    conversationsByProject.get(projectId)!.push(conversation);
  }

  return (
    <div className="space-y-6">
      {Array.from(conversationsByProject.entries()).map(
        ([projectId, projectConversations]) => {
          const project = projectsById.get(projectId);
          const projectName =
            project?.name ?? projectConversations[0]?.project?.name ?? "Project";

          return (
            <section key={projectId} className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">
                {projectName}
              </h2>
              <div className="space-y-2">
                {projectConversations.map((conversation) => (
                  <ConversationCard
                    key={conversation.id}
                    conversation={conversation}
                  />
                ))}
              </div>
            </section>
          );
        }
      )}
    </div>
  );
}

interface ConversationCardProps {
  readonly conversation: Conversation;
}

function ConversationCard({ conversation }: ConversationCardProps) {
  const lastMessage = conversation.messages?.[0];
  const preview = lastMessage?.content
    ? lastMessage.content.length > 100
      ? lastMessage.content.slice(0, 100) + "..."
      : lastMessage.content
    : null;

  return (
    <Link href={`/messages/${conversation.id}`} className="block">
      <Card className="transition-colors hover:border-primary/50">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-foreground">
                  {conversation.subject ?? "Conversation"}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {conversation.messageCount} message
                  {conversation.messageCount === 1 ? "" : "s"}
                </span>
              </div>
              {preview && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {preview}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {conversation.lastMessageAt && (
              <span className="text-sm text-muted-foreground">
                {formatRelativeTime(conversation.lastMessageAt)}
              </span>
            )}
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function MessagesPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4 p-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
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
