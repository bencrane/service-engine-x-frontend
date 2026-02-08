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
