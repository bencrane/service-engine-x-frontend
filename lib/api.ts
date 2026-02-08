const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.serviceengine.xyz";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Proposal {
  id: string;
  number: string;
  status: "draft" | "sent" | "viewed" | "signed" | "declined";
  client: Client;
  lineItems: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  validUntil: string;
  createdAt: string;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  scheduledDate?: string;
}

export interface Order {
  id: string;
  number: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  client: Client;
  services: Service[];
  total: number;
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getProposal(id: string): Promise<Proposal> {
  return fetchAPI<Proposal>(`/api/proposals/${id}`);
}

export async function getOrder(id: string): Promise<Order> {
  return fetchAPI<Order>(`/api/orders/${id}`);
}
