import { SectionList, SectionListItem } from "@/components/ui/section";
import { formatDateTime } from "@/lib/utils";
import type { OrderMessage } from "@/types";

interface MessageListProps {
  readonly messages: ReadonlyArray<OrderMessage>;
}

export function MessageList({ messages }: MessageListProps) {
  const publicMessages = messages.filter((message) => !message.isInternal);

  if (publicMessages.length === 0) {
    return null;
  }

  return (
    <SectionList title="Messages">
      {publicMessages.map((message) => (
        <SectionListItem key={message.id}>
          <div className="flex items-start gap-3">
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted"
              aria-hidden="true"
            >
              <span className="text-sm font-medium text-muted-foreground">
                {message.sender.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {message.sender}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(message.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>
        </SectionListItem>
      ))}
    </SectionList>
  );
}
