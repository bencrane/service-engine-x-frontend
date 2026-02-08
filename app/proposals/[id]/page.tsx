import { getProposal } from "@/lib/api";
import ProposalView from "@/components/ProposalView";

interface ProposalPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { id } = await params;

  try {
    const proposal = await getProposal(id);
    return <ProposalView proposal={proposal} />;
  } catch (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h1 className="text-xl font-semibold text-red-800 mb-2">
            Proposal Not Found
          </h1>
          <p className="text-red-600">
            The proposal you&apos;re looking for doesn&apos;t exist or you don&apos;t have
            permission to view it.
          </p>
        </div>
      </div>
    );
  }
}
