import { MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function MessagesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Messages
        </h1>
        <p className="text-muted-foreground">
          Communication with your service provider
        </p>
      </div>

      <EmptyState
        title="No messages yet"
        description="Messages from your service provider will appear here. You'll be notified when you receive new messages."
        icon={<MessageSquare className="h-6 w-6 text-muted-foreground" />}
      />
    </div>
  );
}
