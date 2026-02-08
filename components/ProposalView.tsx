"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ClientInfo } from "@/components/features/client-info";
import { LineItemsTable } from "@/components/features/line-items-table";
import { NotesSection } from "@/components/features/notes-section";
import { formatDate } from "@/lib/utils";
import type { Proposal } from "@/types";

interface ProposalViewProps {
  readonly proposal: Proposal;
}

const SIGNED_STATUSES = ["signed", "approved", "declined"];

export function ProposalView({ proposal }: ProposalViewProps) {
  const handleSign = (): void => {
    console.log("Sign proposal clicked", { proposalId: proposal.id });
  };

  const canSign = !SIGNED_STATUSES.includes(proposal.status.toLowerCase());

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title={`Proposal ${proposal.number ?? proposal.id}`}
        description={
          proposal.createdAt ? `Created ${formatDate(proposal.createdAt)}` : undefined
        }
        badge={<StatusBadge status={proposal.status} />}
        actions={
          canSign ? (
            <Button onClick={handleSign} size="lg">
              Sign Proposal
            </Button>
          ) : undefined
        }
      />

      <ClientInfo client={proposal.client} clientName={proposal.clientName} />

      {proposal.lineItems && proposal.lineItems.length > 0 && (
        <LineItemsTable
          lineItems={proposal.lineItems}
          subtotal={proposal.subtotal}
          tax={proposal.tax}
          total={proposal.total}
        />
      )}

      {proposal.notes && <NotesSection notes={proposal.notes} />}

      {proposal.validUntil && (
        <p className="text-sm text-muted-foreground">
          This proposal is valid until {formatDate(proposal.validUntil)}
        </p>
      )}
    </div>
  );
}

export default ProposalView;
