import { Suspense } from "react";
import { fetchConversations, ApiError } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Conversation, Message } from "@/types";

export default function InboxPage() {
  return (
    <Suspense fallback={<InboxSkeleton />}>
      <InboxContent />
    </Suspense>
  );
}

async function InboxContent() {
  let conversations: ReadonlyArray<Conversation> = [];
  let error: string | null = null;

  try {
    conversations = await fetchConversations().catch(() => []);
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
        title="Unable to load inbox"
        description={error}
        action={{ label: "Try again", href: "/inbox" }}
      />
    );
  }

  // Get all messages from conversations
  const allMessages: Array<Message & { projectName?: string }> = conversations
    .flatMap((c) =>
      (c.messages ?? []).map((m) => ({
        ...m,
        projectName: c.project?.name ?? c.subject,
      }))
    )
    .filter((m) => !m.isInternal)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
        <p className="mt-1 text-muted-foreground">
          Messages from your project team
        </p>
      </header>

      {allMessages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No messages yet. Your team will reach out here when there are updates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {allMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex gap-4 p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <span className="text-sm font-medium">
                      {message.sender?.name?.charAt(0) ?? "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">
                          {message.sender?.name ?? "Team"}
                        </p>
                        {message.projectName && (
                          <span className="text-xs text-muted-foreground">
                            · {message.projectName}
                          </span>
                        )}
                      </div>
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
      )}
    </div>
  );
}

function InboxSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-24 rounded bg-muted animate-pulse" />
        <div className="mt-2 h-4 w-48 rounded bg-muted animate-pulse" />
      </div>
      <Card>
        <CardContent className="p-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 border-b border-border last:border-0">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                <div className="h-4 w-full rounded bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
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
