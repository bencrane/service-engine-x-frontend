"use client";

import { Proposal } from "@/lib/api";

interface ProposalViewProps {
  proposal: Proposal;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  viewed: "bg-yellow-100 text-yellow-800",
  signed: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
};

export default function ProposalView({ proposal }: ProposalViewProps) {
  const handleSign = () => {
    console.log("Sign proposal clicked", { proposalId: proposal.id });
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    return statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ");
  };

  // Get client name from either client object or clientName field
  const clientName = proposal.client?.name || proposal.clientName || "Unknown Client";
  const clientEmail = proposal.client?.email;
  const clientPhone = proposal.client?.phone;
  const clientAddress = proposal.client?.address;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Proposal {proposal.number || proposal.id}
          </h1>
          {proposal.createdAt && (
            <p className="text-sm text-gray-500 mt-1">
              Created {formatDate(proposal.createdAt)}
            </p>
          )}
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(proposal.status)}`}
        >
          {formatStatus(proposal.status)}
        </span>
      </div>

      {/* Client Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          Client
        </h2>
        <div className="space-y-1">
          <p className="text-lg font-medium text-gray-900">{clientName}</p>
          {clientEmail && <p className="text-gray-600">{clientEmail}</p>}
          {clientPhone && <p className="text-gray-600">{clientPhone}</p>}
          {clientAddress && <p className="text-gray-600">{clientAddress}</p>}
        </div>
      </div>

      {/* Line Items */}
      {proposal.lineItems && proposal.lineItems.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Line Items
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {proposal.lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          {(proposal.subtotal !== undefined || proposal.total !== undefined) && (
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  {proposal.subtotal !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">
                        {formatCurrency(proposal.subtotal)}
                      </span>
                    </div>
                  )}
                  {proposal.tax !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">
                        {formatCurrency(proposal.tax)}
                      </span>
                    </div>
                  )}
                  {proposal.total !== undefined && (
                    <div className="flex justify-between text-base font-medium border-t border-gray-200 pt-2">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">
                        {formatCurrency(proposal.total)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {proposal.notes && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Notes
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">{proposal.notes}</p>
        </div>
      )}

      {/* Valid Until */}
      {proposal.validUntil && (
        <div className="text-sm text-gray-500 mb-6">
          This proposal is valid until {formatDate(proposal.validUntil)}
        </div>
      )}

      {/* Sign Button */}
      {proposal.status !== "signed" && proposal.status !== "declined" && proposal.status !== "approved" && (
        <div className="flex justify-end">
          <button
            onClick={handleSign}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Sign Proposal
          </button>
        </div>
      )}

      {/* Debug: Show raw proposal data */}
      <details className="mt-8">
        <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-600">
          View raw proposal data
        </summary>
        <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-xs overflow-auto max-h-96">
          {JSON.stringify(proposal, null, 2)}
        </pre>
      </details>
    </div>
  );
}
