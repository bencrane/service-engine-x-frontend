/**
 * Core API Types
 * All types are strictly defined - no `any` types permitted
 * Types are derived from /lib/openapi.json - the source of truth for all API schemas.
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

/** Project phases (1-6) */
export type ProjectPhase =
  | "kickoff"
  | "setup"
  | "build"
  | "testing"
  | "deployment"
  | "handoff";

export const PROJECT_PHASES: ReadonlyArray<{
  id: number;
  name: ProjectPhase;
  label: string;
}> = [
  { id: 1, name: "kickoff", label: "Kickoff" },
  { id: 2, name: "setup", label: "Setup" },
  { id: 3, name: "build", label: "Build" },
  { id: 4, name: "testing", label: "Testing" },
  { id: 5, name: "deployment", label: "Deployment" },
  { id: 6, name: "handoff", label: "Handoff" },
];

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

/** Transformed from OrderTaskResponse in openapi.json */
export interface OrderTask {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly status: TaskStatus | string;
  readonly isPublic?: boolean;
  readonly forClient?: boolean;
  readonly completedAt?: string;
  readonly dueDate?: string;
  readonly sortOrder?: number;
}

/** Transformed from OrderMessageResponse in openapi.json */
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
// Engagement/Project Model Types
// =============================================================================

/** Summary of a project within an engagement */
export interface ProjectSummary {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly statusId: number;
  readonly phase: string;
  readonly phaseId: number;
}

/** Summary of a conversation within an engagement */
export interface ConversationSummary {
  readonly id: string;
  readonly subject?: string;
  readonly status: string;
  readonly messageCount: number;
  readonly lastMessageAt?: string;
}

/** Transformed from EngagementResponse in openapi.json */
export interface Engagement {
  readonly id: string;
  readonly name?: string;
  readonly status: string;
  readonly statusId: number;
  readonly clientId: string;
  readonly client?: {
    readonly id: string;
    readonly name: string;
    readonly email: string;
  };
  readonly projects?: ReadonlyArray<ProjectSummary>;
  readonly conversations?: ReadonlyArray<ConversationSummary>;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly closedAt?: string;
}

/** Transformed from ProjectResponse in openapi.json */
export interface Project {
  readonly id: string;
  readonly engagementId: string;
  readonly name: string;
  readonly description?: string;
  readonly status: string;
  readonly statusId: number;
  readonly phase: string;
  readonly phaseId: number;
  readonly service?: {
    readonly id: string;
    readonly name: string;
  };
  readonly engagement?: {
    readonly id: string;
    readonly name?: string;
    readonly status: string;
  };
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly completedAt?: string;
}

/** Sender of a message */
export interface MessageSender {
  readonly id: string;
  readonly name: string;
  readonly type: string;
}

/** Transformed from MessageResponse in openapi.json */
export interface Message {
  readonly id: string;
  readonly conversationId: string;
  readonly senderId: string;
  readonly sender?: MessageSender;
  readonly content: string;
  readonly isInternal: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** Transformed from ConversationResponse in openapi.json */
export interface Conversation {
  readonly id: string;
  readonly projectId: string;
  readonly subject?: string;
  readonly status: string;
  readonly statusId: number;
  readonly project?: {
    readonly id: string;
    readonly name: string;
  };
  readonly messages?: ReadonlyArray<Message>;
  readonly messageCount: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly lastMessageAt?: string;
}

// =============================================================================
// Aggregate Types
// =============================================================================

/** Transformed from OrderResponse in openapi.json */
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

/** Transformed from ProposalResponse in openapi.json */
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
