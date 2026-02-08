import type { Order, Proposal } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.serviceengine.xyz";
const API_TOKEN = process.env.API_TOKEN;

// =============================================================================
// Error Handling
// =============================================================================

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// =============================================================================
// Core Fetch Utility
// =============================================================================

async function fetchApi<T>(endpoint: string): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (API_TOKEN) {
    headers["Authorization"] = `Bearer ${API_TOKEN}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

// =============================================================================
// Order API
// =============================================================================

export async function fetchOrder(id: string): Promise<Order> {
  return fetchApi<Order>(`/api/orders/${id}`);
}

export async function fetchOrders(): Promise<ReadonlyArray<Order>> {
  return fetchApi<ReadonlyArray<Order>>(`/api/orders`);
}

// =============================================================================
// Proposal API
// =============================================================================

export async function fetchProposal(id: string): Promise<Proposal> {
  return fetchApi<Proposal>(`/api/proposals/${id}`);
}

export async function fetchProposals(): Promise<ReadonlyArray<Proposal>> {
  return fetchApi<ReadonlyArray<Proposal>>(`/api/proposals`);
}
