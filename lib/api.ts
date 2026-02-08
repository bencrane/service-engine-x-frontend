const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.serviceengine.xyz";
const API_TOKEN = process.env.API_TOKEN;

// API Response Types - flexible to handle real API data
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface OrderTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  assignedTo?: string;
  dueDate?: string;
  completedAt?: string;
}

export interface OrderMessage {
  id: string;
  content: string;
  sender: string;
  createdAt: string;
  isInternal?: boolean;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  number?: string;
  status: string;
  client?: Client;
  clientName?: string;
  service?: string;
  services?: Array<{
    id: string;
    name: string;
    description?: string;
    status?: string;
    scheduledDate?: string;
  }>;
  tasks?: OrderTask[];
  messages?: OrderMessage[];
  lineItems?: LineItem[];
  total?: number;
  subtotal?: number;
  tax?: number;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  notes?: string;
  [key: string]: unknown; // Allow additional fields from API
}

export interface Proposal {
  id: string;
  number?: string;
  status: string;
  client?: Client;
  clientName?: string;
  lineItems?: LineItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  validUntil?: string;
  createdAt?: string;
  notes?: string;
  [key: string]: unknown;
}

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "APIError";
  }
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
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
    throw new APIError(response.status, `API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchOrder(id: string): Promise<Order> {
  return fetchAPI<Order>(`/api/orders/${id}`);
}

export async function fetchOrders(): Promise<Order[]> {
  return fetchAPI<Order[]>(`/api/orders`);
}

export async function fetchProposal(id: string): Promise<Proposal> {
  return fetchAPI<Proposal>(`/api/proposals/${id}`);
}

export async function fetchProposals(): Promise<Proposal[]> {
  return fetchAPI<Proposal[]>(`/api/proposals`);
}

// Keep old function names for backwards compatibility
export const getOrder = fetchOrder;
export const getProposal = fetchProposal;
