import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { ClientInfo } from "@/components/features/client-info";
import { SingleService, ServiceList } from "@/components/features/service-list";
import { TaskList } from "@/components/features/task-list";
import { MessageList } from "@/components/features/message-list";
import { LineItemsTable } from "@/components/features/line-items-table";
import { OrderTotal } from "@/components/features/order-total";
import { NotesSection } from "@/components/features/notes-section";
import { formatDate } from "@/lib/utils";
import type { Order } from "@/types";

interface OrderViewProps {
  readonly order: Order;
}

export function OrderView({ order }: OrderViewProps) {
  const hasLineItems = order.lineItems && order.lineItems.length > 0;
  const showOrderTotal = !hasLineItems && (order.total !== undefined || order.subtotal !== undefined);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title={`Order ${order.number ?? order.id}`}
        description={order.createdAt ? `Created ${formatDate(order.createdAt)}` : undefined}
        badge={<StatusBadge status={order.status} />}
      />

      <ClientInfo client={order.client} clientName={order.clientName} />

      {order.service && <SingleService service={order.service} />}

      {order.services && order.services.length > 0 && (
        <ServiceList services={order.services} />
      )}

      {order.tasks && order.tasks.length > 0 && (
        <TaskList tasks={order.tasks} />
      )}

      {order.messages && order.messages.length > 0 && (
        <MessageList messages={order.messages} />
      )}

      {hasLineItems && (
        <LineItemsTable
          lineItems={order.lineItems!}
          subtotal={order.subtotal}
          tax={order.tax}
          total={order.total}
        />
      )}

      {showOrderTotal && (
        <OrderTotal
          subtotal={order.subtotal}
          tax={order.tax}
          total={order.total}
        />
      )}

      {order.notes && <NotesSection notes={order.notes} />}

      {order.completedAt && (
        <p className="text-sm text-muted-foreground">
          Completed on {formatDate(order.completedAt)}
        </p>
      )}
    </div>
  );
}

export default OrderView;
