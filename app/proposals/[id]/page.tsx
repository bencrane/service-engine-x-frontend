import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchProposal, ApiError } from "@/lib/api";
import { ProposalView } from "@/components/ProposalView";
import { ProposalSkeleton } from "@/components/features/proposal-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertCircle } from "lucide-react";

interface ProposalPageProps {
  params: Promise<{ id: string }>;
}

async function ProposalContent({ id }: { id: string }) {
  try {
    const proposal = await fetchProposal(id);
    return <ProposalView proposal={proposal} />;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    return (
      <EmptyState
        title="Unable to load proposal"
        description="We couldn't retrieve this proposal. Please check the URL or try again later."
        icon={<AlertCircle className="h-6 w-6 text-destructive" />}
        action={{
          label: "Go to homepage",
          href: "/",
        }}
      />
    );
  }
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<ProposalSkeleton />}>
      <ProposalContent id={id} />
    </Suspense>
  );
}
