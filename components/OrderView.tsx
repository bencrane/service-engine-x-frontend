"use client";

import { Order } from "@/lib/api";

interface OrderViewProps {
  order: Order;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  active: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const taskStatusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

export default function OrderView({ order }: OrderViewProps) {
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

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ");
  };

  const getStatusColor = (status: string) => {
    return statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  // Get client name from either client object or clientName field
  const clientName = order.client?.name || order.clientName || "Unknown Client";
  const clientEmail = order.client?.email;
  const clientPhone = order.client?.phone;
  const clientAddress = order.client?.address;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Order {order.number || order.id}
          </h1>
          {order.createdAt && (
            <p className="text-sm text-gray-500 mt-1">
              Created {formatDate(order.createdAt)}
            </p>
          )}
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}
        >
          {formatStatus(order.status)}
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

      {/* Service (single) */}
      {order.service && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Service
          </h2>
          <p className="text-lg font-medium text-gray-900">{order.service}</p>
        </div>
      )}

      {/* Services (multiple) */}
      {order.services && order.services.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Services
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {order.services.map((service) => (
              <div key={service.id} className="px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {service.description}
                      </p>
                    )}
                    {service.scheduledDate && (
                      <p className="text-sm text-gray-500 mt-1">
                        Scheduled: {formatDate(service.scheduledDate)}
                      </p>
                    )}
                  </div>
                  {service.status && (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(service.status)}`}
                    >
                      {formatStatus(service.status)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks */}
      {order.tasks && order.tasks.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Tasks
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {order.tasks.map((task) => (
              <div key={task.id} className="px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      {task.assignedTo && (
                        <span>Assigned to: {task.assignedTo}</span>
                      )}
                      {task.dueDate && (
                        <span>Due: {formatDate(task.dueDate)}</span>
                      )}
                      {task.completedAt && (
                        <span>Completed: {formatDate(task.completedAt)}</span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      taskStatusColors[task.status.toLowerCase()] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {formatStatus(task.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {order.messages && order.messages.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Messages
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {order.messages
              .filter((msg) => !msg.isInternal)
              .map((message) => (
                <div key={message.id} className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {message.sender.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {message.sender}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(message.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Line Items */}
      {order.lineItems && order.lineItems.length > 0 && (
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
                {order.lineItems.map((item) => (
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
        </div>
      )}

      {/* Order Total */}
      {(order.total !== undefined || order.subtotal !== undefined) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="space-y-2">
            {order.subtotal !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
              </div>
            )}
            {order.tax !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">{formatCurrency(order.tax)}</span>
              </div>
            )}
            {order.total !== undefined && (
              <div className="flex justify-between text-lg font-medium border-t border-gray-200 pt-2 mt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatCurrency(order.total)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Notes
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">{order.notes}</p>
        </div>
      )}

      {/* Completed Date */}
      {order.completedAt && (
        <div className="text-sm text-gray-500">
          Completed on {formatDate(order.completedAt)}
        </div>
      )}

      {/* Debug: Show raw order data */}
      <details className="mt-8">
        <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-600">
          View raw order data
        </summary>
        <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-xs overflow-auto max-h-96">
          {JSON.stringify(order, null, 2)}
        </pre>
      </details>
    </div>
  );
}
