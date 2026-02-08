"use client";

import { Order } from "@/lib/api";

interface OrderViewProps {
  order: Order;
}

const statusColors: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const serviceStatusColors: Record<Order["services"][number]["status"], string> = {
  pending: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

export default function OrderView({ order }: OrderViewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Order {order.number}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Created {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
            statusColors[order.status]
          }`}
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
          <p className="text-lg font-medium text-gray-900">{order.client.name}</p>
          <p className="text-gray-600">{order.client.email}</p>
          {order.client.phone && (
            <p className="text-gray-600">{order.client.phone}</p>
          )}
          {order.client.address && (
            <p className="text-gray-600">{order.client.address}</p>
          )}
        </div>
      </div>

      {/* Services */}
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
                  <p className="text-sm text-gray-600 mt-1">
                    {service.description}
                  </p>
                  {service.scheduledDate && (
                    <p className="text-sm text-gray-500 mt-1">
                      Scheduled: {formatDate(service.scheduledDate)}
                    </p>
                  )}
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    serviceStatusColors[service.status]
                  }`}
                >
                  {formatStatus(service.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Total */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-900">Order Total</span>
          <span className="text-2xl font-semibold text-gray-900">
            {formatCurrency(order.total)}
          </span>
        </div>
      </div>

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
    </div>
  );
}
