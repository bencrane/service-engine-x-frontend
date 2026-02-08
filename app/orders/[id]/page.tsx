import { getOrder } from "@/lib/api";
import OrderView from "@/components/OrderView";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

  try {
    const order = await getOrder(id);
    return <OrderView order={order} />;
  } catch (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h1 className="text-xl font-semibold text-red-800 mb-2">
            Order Not Found
          </h1>
          <p className="text-red-600">
            The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have
            permission to view it.
          </p>
        </div>
      </div>
    );
  }
}
