import Link from "next/link";

// Test order ID - replace with a real order ID from your API
const TEST_ORDER_ID = "test-order-123";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Service Engine
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your customer portal for viewing proposals and orders.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Proposals</h2>
          <p className="text-gray-600 mb-4">
            View and sign proposals sent to you. Review line items, pricing, and
            terms before accepting.
          </p>
          <p className="text-sm text-gray-500">
            Access your proposals via the link provided in your email.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Orders</h2>
          <p className="text-gray-600 mb-4">
            Track the status of your orders and scheduled services. See what&apos;s
            completed and what&apos;s coming up.
          </p>
          <p className="text-sm text-gray-500">
            Access your orders via the link provided in your email.
          </p>
        </div>
      </div>

      {/* Test Links Section */}
      <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
          Test Links
        </h3>
        <div className="space-y-3">
          <div>
            <Link
              href={`/orders/${TEST_ORDER_ID}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Test Order →
            </Link>
            <p className="text-xs text-gray-500 mt-1">
              Order ID: {TEST_ORDER_ID}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500">
          Need help? Contact us at{" "}
          <a
            href="mailto:support@serviceengine.xyz"
            className="text-blue-600 hover:underline"
          >
            support@serviceengine.xyz
          </a>
        </p>
      </div>
    </div>
  );
}
