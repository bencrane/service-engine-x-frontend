/**
 * Core API Types
 * All types are strictly defined - no `any` types permitted
 */

// =============================================================================
// Base Types
// =============================================================================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "active"
  | "completed"
  | "cancelled";

export type ProposalStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "signed"
  | "declined"
  | "pending"
  | "approved";

export type TaskStatus = "pending" | "in_progress" | "completed";

// =============================================================================
// Entity Types
// =============================================================================

export interface Client {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
  readonly address?: string;
}

export interface LineItem {
  readonly id: string;
  readonly description: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly total: number;
}

export interface OrderTask {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly status: TaskStatus | string;
  readonly assignedTo?: string;
  readonly dueDate?: string;
  readonly completedAt?: string;
}

export interface OrderMessage {
  readonly id: string;
  readonly content: string;
  readonly sender: string;
  readonly createdAt: string;
  readonly isInternal?: boolean;
}

export interface Service {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly status?: string;
  readonly scheduledDate?: string;
}

// =============================================================================
// Aggregate Types
// =============================================================================

export interface Order {
  readonly id: string;
  readonly number?: string;
  readonly status: OrderStatus | string;
  readonly client?: Client;
  readonly clientName?: string;
  readonly service?: string;
  readonly services?: ReadonlyArray<Service>;
  readonly tasks?: ReadonlyArray<OrderTask>;
  readonly messages?: ReadonlyArray<OrderMessage>;
  readonly lineItems?: ReadonlyArray<LineItem>;
  readonly total?: number;
  readonly subtotal?: number;
  readonly tax?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly completedAt?: string;
  readonly notes?: string;
}

export interface Proposal {
  readonly id: string;
  readonly number?: string;
  readonly status: ProposalStatus | string;
  readonly client?: Client;
  readonly clientName?: string;
  readonly lineItems?: ReadonlyArray<LineItem>;
  readonly subtotal?: number;
  readonly tax?: number;
  readonly total?: number;
  readonly validUntil?: string;
  readonly createdAt?: string;
  readonly notes?: string;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiError {
  readonly status: number;
  readonly message: string;
}

export interface ApiResponse<T> {
  readonly data: T;
  readonly error?: ApiError;
}

// =============================================================================
// Component Prop Types
// =============================================================================

export interface StatusBadgeProps {
  readonly status: string;
  readonly variant?: "default" | "outline";
}

export interface CardProps {
  readonly title?: string;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly action?: {
    readonly label: string;
    readonly href: string;
  };
}
