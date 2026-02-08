import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchOrder, ApiError } from "@/lib/api";
import { OrderView } from "@/components/OrderView";
import { OrderSkeleton } from "@/components/features/order-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertCircle } from "lucide-react";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

async function OrderContent({ id }: { id: string }) {
  try {
    const order = await fetchOrder(id);
    return <OrderView order={order} />;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    return (
      <EmptyState
        title="Unable to load order"
        description="We couldn't retrieve this order. Please check the URL or try again later."
        icon={<AlertCircle className="h-6 w-6 text-destructive" />}
        action={{
          label: "Go to homepage",
          href: "/",
        }}
      />
    );
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<OrderSkeleton />}>
      <OrderContent id={id} />
    </Suspense>
  );
}
