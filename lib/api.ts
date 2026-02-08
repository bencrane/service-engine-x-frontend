/**
 * Service Engine X API Client
 *
 * Server-side only - API_TOKEN must never be exposed to the client.
 * All functions in this module should only be called from React Server Components
 * or server-side code (API routes, server actions).
 */

import type { Order, Proposal } from "@/types";

// =============================================================================
// Configuration
// =============================================================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.serviceengine.xyz";
const API_TOKEN = process.env.API_TOKEN;

// Runtime check to ensure we're on the server
function assertServerSide(): void {
  if (typeof window !== "undefined") {
    throw new Error(
      "API client functions must only be called from server-side code. " +
        "The API_TOKEN is a secret and cannot be exposed to the browser."
    );
  }
}

// =============================================================================
// Error Handling
// =============================================================================

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly endpoint?: string
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}

// =============================================================================
// Core Fetch Utility
// =============================================================================

async function fetchApi<T>(endpoint: string): Promise<T> {
  assertServerSide();

  if (!API_TOKEN) {
    throw new ApiError(
      401,
      "API_TOKEN is not configured. Please set it in your environment variables.",
      endpoint
    );
  }

  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);
      throw new ApiError(response.status, errorMessage, endpoint);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    throw new ApiError(
      0,
      error instanceof Error ? error.message : "Network error occurred",
      endpoint
    );
  }
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body === "object" && body !== null) {
      // Handle FastAPI error format
      if ("detail" in body) {
        return typeof body.detail === "string"
          ? body.detail
          : JSON.stringify(body.detail);
      }
      if ("message" in body) {
        return String(body.message);
      }
    }
  } catch {
    // Response body is not JSON
  }

  return `${response.status} ${response.statusText}`;
}

// =============================================================================
// Order API
// =============================================================================

/**
 * Fetch a single order by ID.
 * Server-side only.
 *
 * @param id - The order ID
 * @throws ApiError if the order is not found or request fails
 */
export async function fetchOrder(id: string): Promise<Order> {
  const data = await fetchApi<OrderApiResponse>(`/api/orders/${id}`);
  return transformOrderResponse(data);
}

/**
 * Fetch all orders.
 * Server-side only.
 *
 * @throws ApiError if the request fails
 */
export async function fetchOrders(): Promise<ReadonlyArray<Order>> {
  const response = await fetchApi<OrderListApiResponse>(`/api/orders`);
  return response.data.map(transformOrderResponse);
}

// =============================================================================
// Proposal API
// =============================================================================

/**
 * Fetch a single proposal by ID.
 * Server-side only.
 *
 * @param id - The proposal ID
 * @throws ApiError if the proposal is not found or request fails
 */
export async function fetchProposal(id: string): Promise<Proposal> {
  const data = await fetchApi<ProposalApiResponse>(`/api/proposals/${id}`);
  return transformProposalResponse(data);
}

/**
 * Fetch all proposals.
 * Server-side only.
 *
 * @throws ApiError if the request fails
 */
export async function fetchProposals(): Promise<ReadonlyArray<Proposal>> {
  const response = await fetchApi<ProposalListApiResponse>(`/api/proposals`);
  return response.data.map(transformProposalResponse);
}

// =============================================================================
// API Response Types (from OpenAPI spec)
// =============================================================================

interface OrderClientApiResponse {
  readonly id: string;
  readonly name: string;
  readonly email?: string | null;
  readonly phone?: string | null;
}

interface OrderEmployeeApiResponse {
  readonly id: string;
  readonly name: string;
}

interface OrderApiResponse {
  readonly id: string;
  readonly number: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly last_message_at?: string | null;
  readonly date_started?: string | null;
  readonly date_completed?: string | null;
  readonly date_due?: string | null;
  readonly client?: OrderClientApiResponse | null;
  readonly tags: ReadonlyArray<string>;
  readonly status: string;
  readonly status_id: number;
  readonly price: number;
  readonly quantity: number;
  readonly invoice_id?: string | null;
  readonly service: string;
  readonly service_id?: string | null;
  readonly user_id: string;
  readonly employees: ReadonlyArray<OrderEmployeeApiResponse>;
  readonly note?: string | null;
  readonly form_data?: Record<string, unknown>;
}

interface OrderListApiResponse {
  readonly data: ReadonlyArray<OrderApiResponse>;
  readonly meta: {
    readonly total: number;
    readonly current_page: number;
    readonly per_page: number;
  };
}

interface ProposalItemApiResponse {
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly quantity: number;
  readonly price: string;
  readonly total: string;
}

interface ProposalApiResponse {
  readonly id: string;
  readonly client_email: string;
  readonly client_name: string;
  readonly client_name_f: string;
  readonly client_name_l: string;
  readonly client_company?: string | null;
  readonly status: string;
  readonly status_id: number;
  readonly total: string;
  readonly notes?: string | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly sent_at?: string | null;
  readonly signed_at?: string | null;
  readonly converted_order_id?: string | null;
  readonly items: ReadonlyArray<ProposalItemApiResponse>;
}

interface ProposalListApiResponse {
  readonly data: ReadonlyArray<ProposalApiResponse>;
  readonly meta: {
    readonly total: number;
    readonly current_page: number;
    readonly per_page: number;
  };
}

// =============================================================================
// Response Transformers
// =============================================================================

function transformOrderResponse(data: OrderApiResponse): Order {
  return {
    id: data.id,
    number: data.number,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    completedAt: data.date_completed ?? undefined,
    client: data.client
      ? {
          id: data.client.id,
          name: data.client.name,
          email: data.client.email ?? undefined,
          phone: data.client.phone ?? undefined,
        }
      : undefined,
    service: data.service,
    total: data.price || undefined,
    notes: data.note ?? undefined,
  };
}

function transformProposalResponse(data: ProposalApiResponse): Proposal {
  return {
    id: data.id,
    status: data.status,
    createdAt: data.created_at,
    client: {
      id: data.client_email, // Using email as ID since no separate client ID
      name: data.client_name,
      email: data.client_email,
    },
    clientName: data.client_name,
    lineItems: data.items.map((item) => ({
      id: item.id,
      description: item.name,
      quantity: item.quantity,
      unitPrice: parseFloat(item.price) || 0,
      total: parseFloat(item.total) || 0,
    })),
    total: parseFloat(data.total) || undefined,
    notes: data.notes ?? undefined,
    validUntil: undefined, // Not in API response
  };
}
