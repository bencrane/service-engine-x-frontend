/**
 * Service Engine X API Client
 *
 * Server-side only - API_TOKEN must never be exposed to the client.
 * All functions in this module should only be called from React Server Components
 * or server-side code (API routes, server actions).
 *
 * Types are derived from /lib/openapi.json - the source of truth for all API schemas.
 */

import type {
  Order,
  OrderTask,
  OrderMessage,
  Proposal,
  Engagement,
  Project,
  Conversation,
  Message,
} from "@/types";

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
// Core Fetch Utilities
// =============================================================================

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  assertServerSide();

  if (!API_TOKEN) {
    throw new ApiError(
      401,
      "API_TOKEN is not configured. Please set it in your environment variables.",
      endpoint
    );
  }

  const url = `${API_URL}${endpoint}`;
  const { method = "GET", body } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: body ? JSON.stringify(body) : undefined,
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
// API Response Types (from OpenAPI spec /lib/openapi.json)
// =============================================================================

/** ClientSummary from openapi.json */
interface ClientSummaryApiResponse {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

/** ProjectSummary from openapi.json */
interface ProjectSummaryApiResponse {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly status_id: number;
  readonly phase: string;
  readonly phase_id: number;
}

/** ConversationSummary from openapi.json */
interface ConversationSummaryApiResponse {
  readonly id: string;
  readonly subject: string | null;
  readonly status: string;
  readonly message_count: number | null;
  readonly last_message_at: string | null;
}

/** EngagementResponse from openapi.json */
interface EngagementApiResponse {
  readonly id: string;
  readonly org_id: string;
  readonly client_id: string;
  readonly client?: ClientSummaryApiResponse | null;
  readonly name: string | null;
  readonly status: string;
  readonly status_id: number;
  readonly proposal_id: string | null;
  readonly projects?: ReadonlyArray<ProjectSummaryApiResponse> | null;
  readonly conversations?: ReadonlyArray<ConversationSummaryApiResponse> | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly closed_at: string | null;
}

/** Paginated list response for engagements */
interface EngagementListApiResponse {
  readonly data: ReadonlyArray<EngagementApiResponse>;
  readonly meta: {
    readonly total: number;
    readonly current_page: number;
    readonly per_page: number;
  };
}

/** ServiceSummary from openapi.json */
interface ServiceSummaryApiResponse {
  readonly id: string;
  readonly name: string;
}

/** EngagementSummary from openapi.json */
interface EngagementSummaryApiResponse {
  readonly id: string;
  readonly name: string | null;
  readonly status: string;
}

/** ProjectResponse from openapi.json */
interface ProjectApiResponse {
  readonly id: string;
  readonly engagement_id: string;
  readonly org_id: string;
  readonly name: string;
  readonly description: string | null;
  readonly status: string;
  readonly status_id: number;
  readonly phase: string;
  readonly phase_id: number;
  readonly service_id: string | null;
  readonly service?: ServiceSummaryApiResponse | null;
  readonly engagement?: EngagementSummaryApiResponse | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly completed_at: string | null;
}

/** Paginated list response for projects */
interface ProjectListApiResponse {
  readonly data: ReadonlyArray<ProjectApiResponse>;
  readonly meta: {
    readonly total: number;
    readonly current_page: number;
    readonly per_page: number;
  };
}

/** SenderSummary from openapi.json */
interface SenderSummaryApiResponse {
  readonly id: string;
  readonly name: string;
  readonly type: string;
}

/** MessageResponse from openapi.json */
interface MessageApiResponse {
  readonly id: string;
  readonly conversation_id: string;
  readonly sender_id: string;
  readonly sender?: SenderSummaryApiResponse | null;
  readonly content: string;
  readonly is_internal: boolean;
  readonly attachments: ReadonlyArray<unknown>;
  readonly created_at: string;
  readonly updated_at: string;
}

/** ProjectBrief from openapi.json */
interface ProjectBriefApiResponse {
  readonly id: string;
  readonly name: string;
}

/** ConversationResponse from openapi.json */
interface ConversationApiResponse {
  readonly id: string;
  readonly project_id: string;
  readonly org_id: string;
  readonly subject: string | null;
  readonly status: string;
  readonly status_id: number;
  readonly project?: ProjectBriefApiResponse | null;
  readonly messages?: ReadonlyArray<MessageApiResponse> | null;
  readonly message_count: number | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly last_message_at: string | null;
}

/** Paginated list response for conversations */
interface ConversationListApiResponse {
  readonly data: ReadonlyArray<ConversationApiResponse>;
  readonly meta: {
    readonly total: number;
    readonly current_page: number;
    readonly per_page: number;
  };
}

/** OrderClientResponse from openapi.json */
interface OrderClientApiResponse {
  readonly id: string;
  readonly name: string;
  readonly name_f: string;
  readonly name_l: string;
  readonly email: string;
  readonly company: string | null;
  readonly phone: string | null;
  readonly address: Record<string, unknown> | null;
  readonly role: Record<string, unknown> | null;
}

/** OrderEmployeeResponse from openapi.json */
interface OrderEmployeeApiResponse {
  readonly id: string;
  readonly name: string;
}

/** OrderResponse from openapi.json */
interface OrderApiResponse {
  readonly id: string;
  readonly number: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly last_message_at: string | null;
  readonly date_started: string | null;
  readonly date_completed: string | null;
  readonly date_due: string | null;
  readonly client: OrderClientApiResponse | null;
  readonly tags: ReadonlyArray<string>;
  readonly status: string;
  readonly status_id: number;
  readonly price: string;
  readonly quantity: number;
  readonly invoice_id: string | null;
  readonly service: string;
  readonly service_id: string | null;
  readonly user_id: string;
  readonly employees: ReadonlyArray<OrderEmployeeApiResponse>;
  readonly note: string | null;
  readonly form_data: Record<string, unknown>;
  readonly paysys: string | null;
}

/** Paginated list response for orders */
interface OrderListApiResponse {
  readonly data: ReadonlyArray<OrderApiResponse>;
  readonly meta: {
    readonly total: number;
    readonly current_page: number;
    readonly per_page: number;
  };
}

/** TaskEmployeeResponse from openapi.json */
interface TaskEmployeeApiResponse {
  readonly id: string;
  readonly name: string;
}

/** OrderTaskResponse from openapi.json */
interface OrderTaskApiResponse {
  readonly id: string;
  readonly order_id: string;
  readonly name: string;
  readonly description: string | null;
  readonly sort_order: number;
  readonly is_public: boolean;
  readonly for_client: boolean;
  readonly is_complete: boolean;
  readonly completed_by: string | null;
  readonly completed_at: string | null;
  readonly deadline: number | null;
  readonly due_at: string | null;
  readonly employees: ReadonlyArray<TaskEmployeeApiResponse>;
}

/** OrderMessageResponse from openapi.json */
interface OrderMessageApiResponse {
  readonly id: string;
  readonly order_id: string;
  readonly user_id: string | null;
  readonly message: string;
  readonly is_public: boolean;
  readonly created_at: string;
  readonly user?: Record<string, unknown> | null;
}

/** OrderMessageCreate from openapi.json */
interface OrderMessageCreateRequest {
  readonly message: string;
  readonly is_public?: boolean;
}

/** ProposalItemResponse from openapi.json */
interface ProposalItemApiResponse {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly quantity: number;
  readonly price: string;
  readonly total: string;
}

/** ProposalResponse from openapi.json */
interface ProposalApiResponse {
  readonly id: string;
  readonly client_email: string;
  readonly client_name: string;
  readonly client_name_f: string;
  readonly client_name_l: string;
  readonly client_company: string | null;
  readonly status: string;
  readonly status_id: number;
  readonly total: string;
  readonly notes: string | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly sent_at: string | null;
  readonly signed_at: string | null;
  readonly converted_order_id: string | null;
  readonly converted_engagement_id?: string | null;
  readonly items: ReadonlyArray<ProposalItemApiResponse>;
}

/** Paginated list response for proposals */
interface ProposalListApiResponse {
  readonly data: ReadonlyArray<ProposalApiResponse>;
  readonly meta: {
    readonly total: number;
    readonly current_page: number;
    readonly per_page: number;
  };
}

// =============================================================================
// Engagement API
// =============================================================================

/**
 * Fetch all engagements for the authenticated organization.
 * GET /api/engagements
 * Server-side only.
 */
export async function fetchEngagements(): Promise<ReadonlyArray<Engagement>> {
  const response = await fetchApi<EngagementListApiResponse>(`/api/engagements`);
  return response.data.map(transformEngagementResponse);
}

/**
 * Fetch a single engagement by ID with projects and conversations.
 * GET /api/engagements/{id}
 * Server-side only.
 */
export async function fetchEngagement(id: string): Promise<Engagement> {
  const data = await fetchApi<EngagementApiResponse>(`/api/engagements/${id}`);
  return transformEngagementResponse(data);
}

// =============================================================================
// Project API
// =============================================================================

/**
 * Fetch all projects for the authenticated organization.
 * GET /api/projects
 * Server-side only.
 */
export async function fetchProjects(
  engagementId?: string
): Promise<ReadonlyArray<Project>> {
  const params = engagementId ? `?engagement_id=${engagementId}` : "";
  const response = await fetchApi<ProjectListApiResponse>(
    `/api/projects${params}`
  );
  return response.data.map(transformProjectResponse);
}

/**
 * Fetch a single project by ID.
 * GET /api/projects/{id}
 * Server-side only.
 */
export async function fetchProject(id: string): Promise<Project> {
  const data = await fetchApi<ProjectApiResponse>(`/api/projects/${id}`);
  return transformProjectResponse(data);
}

// =============================================================================
// Conversation API
// =============================================================================

/**
 * Fetch all conversations for the authenticated organization.
 * GET /api/conversations
 * Server-side only.
 */
export async function fetchConversations(
  engagementId?: string
): Promise<ReadonlyArray<Conversation>> {
  const params = engagementId ? `?engagement_id=${engagementId}` : "";
  const response = await fetchApi<ConversationListApiResponse>(
    `/api/conversations${params}`
  );
  return response.data.map(transformConversationResponse);
}

/**
 * Fetch a single conversation by ID with messages.
 * GET /api/conversations/{id}
 * Server-side only.
 */
export async function fetchConversation(id: string): Promise<Conversation> {
  const data = await fetchApi<ConversationApiResponse>(
    `/api/conversations/${id}`
  );
  return transformConversationResponse(data);
}

/**
 * Fetch messages for a conversation.
 * GET /api/conversations/{id}/messages
 * Server-side only.
 */
export async function fetchConversationMessages(
  conversationId: string
): Promise<ReadonlyArray<Message>> {
  const data = await fetchApi<ReadonlyArray<MessageApiResponse>>(
    `/api/conversations/${conversationId}/messages`
  );
  return data.map(transformMessageResponse);
}

/**
 * Send a message in a conversation.
 * POST /api/conversations/{id}/messages
 * Server-side only.
 */
export async function sendConversationMessage(
  conversationId: string,
  content: string
): Promise<Message> {
  const data = await fetchApi<MessageApiResponse>(
    `/api/conversations/${conversationId}/messages`,
    { method: "POST", body: { content } }
  );
  return transformMessageResponse(data);
}

// =============================================================================
// Order API
// =============================================================================

/**
 * Fetch a single order by ID.
 * GET /api/orders/{id}
 * Server-side only.
 */
export async function fetchOrder(id: string): Promise<Order> {
  const data = await fetchApi<OrderApiResponse>(`/api/orders/${id}`);
  return transformOrderResponse(data);
}

/**
 * Fetch all orders for the authenticated organization.
 * GET /api/orders
 * Server-side only.
 */
export async function fetchOrders(): Promise<ReadonlyArray<Order>> {
  const response = await fetchApi<OrderListApiResponse>(`/api/orders`);
  return response.data.map(transformOrderResponse);
}

// =============================================================================
// Order Tasks API
// =============================================================================

/**
 * Fetch all tasks for an order.
 * GET /api/orders/{order_id}/tasks
 * Server-side only.
 */
export async function fetchOrderTasks(
  orderId: string
): Promise<ReadonlyArray<OrderTask>> {
  const data = await fetchApi<ReadonlyArray<OrderTaskApiResponse>>(
    `/api/orders/${orderId}/tasks`
  );
  return data.map(transformOrderTaskResponse);
}

// =============================================================================
// Order Messages API
// =============================================================================

/**
 * Fetch all messages for an order.
 * GET /api/orders/{order_id}/messages
 * Server-side only.
 */
export async function fetchOrderMessages(
  orderId: string
): Promise<ReadonlyArray<OrderMessage>> {
  const data = await fetchApi<ReadonlyArray<OrderMessageApiResponse>>(
    `/api/orders/${orderId}/messages`
  );
  return data.map(transformOrderMessageResponse);
}

/**
 * Send a message for an order.
 * POST /api/orders/{order_id}/messages
 * Server-side only.
 */
export async function sendOrderMessage(
  orderId: string,
  content: string,
  isPublic: boolean = true
): Promise<OrderMessage> {
  const body: OrderMessageCreateRequest = {
    message: content,
    is_public: isPublic,
  };
  const data = await fetchApi<OrderMessageApiResponse>(
    `/api/orders/${orderId}/messages`,
    { method: "POST", body }
  );
  return transformOrderMessageResponse(data);
}

// =============================================================================
// Proposal API
// =============================================================================

/**
 * Fetch a single proposal by ID.
 * GET /api/proposals/{id}
 * Server-side only.
 */
export async function fetchProposal(id: string): Promise<Proposal> {
  const data = await fetchApi<ProposalApiResponse>(`/api/proposals/${id}`);
  return transformProposalResponse(data);
}

/**
 * Fetch all proposals for the authenticated organization.
 * GET /api/proposals
 * Server-side only.
 */
export async function fetchProposals(): Promise<ReadonlyArray<Proposal>> {
  const response = await fetchApi<ProposalListApiResponse>(`/api/proposals`);
  return response.data.map(transformProposalResponse);
}

// =============================================================================
// Response Transformers
// =============================================================================

function transformEngagementResponse(data: EngagementApiResponse): Engagement {
  return {
    id: data.id,
    name: data.name ?? undefined,
    status: data.status,
    statusId: data.status_id,
    clientId: data.client_id,
    client: data.client
      ? {
          id: data.client.id,
          name: data.client.name,
          email: data.client.email,
        }
      : undefined,
    projects: data.projects?.map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      statusId: p.status_id,
      phase: p.phase,
      phaseId: p.phase_id,
    })),
    conversations: data.conversations?.map((c) => ({
      id: c.id,
      subject: c.subject ?? undefined,
      status: c.status,
      messageCount: c.message_count ?? 0,
      lastMessageAt: c.last_message_at ?? undefined,
    })),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    closedAt: data.closed_at ?? undefined,
  };
}

function transformProjectResponse(data: ProjectApiResponse): Project {
  return {
    id: data.id,
    engagementId: data.engagement_id,
    name: data.name,
    description: data.description ?? undefined,
    status: data.status,
    statusId: data.status_id,
    phase: data.phase,
    phaseId: data.phase_id,
    service: data.service
      ? {
          id: data.service.id,
          name: data.service.name,
        }
      : undefined,
    engagement: data.engagement
      ? {
          id: data.engagement.id,
          name: data.engagement.name ?? undefined,
          status: data.engagement.status,
        }
      : undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    completedAt: data.completed_at ?? undefined,
  };
}

function transformConversationResponse(
  data: ConversationApiResponse
): Conversation {
  return {
    id: data.id,
    projectId: data.project_id,
    subject: data.subject ?? undefined,
    status: data.status,
    statusId: data.status_id,
    project: data.project
      ? {
          id: data.project.id,
          name: data.project.name,
        }
      : undefined,
    messages: data.messages?.map(transformMessageResponse),
    messageCount: data.message_count ?? 0,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    lastMessageAt: data.last_message_at ?? undefined,
  };
}

function transformMessageResponse(data: MessageApiResponse): Message {
  return {
    id: data.id,
    conversationId: data.conversation_id,
    senderId: data.sender_id,
    sender: data.sender
      ? {
          id: data.sender.id,
          name: data.sender.name,
          type: data.sender.type,
        }
      : undefined,
    content: data.content,
    isInternal: data.is_internal,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

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
          email: data.client.email,
          phone: data.client.phone ?? undefined,
        }
      : undefined,
    service: data.service,
    total: parseFloat(data.price) || undefined,
    notes: data.note ?? undefined,
  };
}

function transformOrderTaskResponse(data: OrderTaskApiResponse): OrderTask {
  return {
    id: data.id,
    title: data.name,
    description: data.description ?? undefined,
    status: data.is_complete ? "completed" : "pending",
    isPublic: data.is_public,
    forClient: data.for_client,
    completedAt: data.completed_at ?? undefined,
    dueDate: data.due_at ?? undefined,
    sortOrder: data.sort_order,
  };
}

function transformOrderMessageResponse(
  data: OrderMessageApiResponse
): OrderMessage {
  const senderName =
    data.user && typeof data.user === "object" && "name" in data.user
      ? String(data.user.name)
      : "Service Team";

  return {
    id: data.id,
    content: data.message,
    sender: senderName,
    createdAt: data.created_at,
    isInternal: !data.is_public,
  };
}

function transformProposalResponse(data: ProposalApiResponse): Proposal {
  return {
    id: data.id,
    status: data.status,
    createdAt: data.created_at,
    client: {
      id: data.client_email,
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
    validUntil: undefined,
  };
}
