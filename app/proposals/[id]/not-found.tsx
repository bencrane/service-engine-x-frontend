import { EmptyState } from "@/components/ui/empty-state";
import { FileQuestion } from "lucide-react";

export default function ProposalNotFound() {
  return (
    <div className="max-w-4xl mx-auto">
      <EmptyState
        title="Proposal not found"
        description="The proposal you're looking for doesn't exist or you don't have permission to view it."
        icon={<FileQuestion className="h-6 w-6 text-muted-foreground" />}
        action={{
          label: "Go to homepage",
          href: "/",
        }}
      />
    </div>
  );
}
