# Service Engine Customer Portal - Architecture Documentation

## Overview

This document details the Stripe-level frontend engineering standards applied to the Service Engine customer portal. The codebase has been refactored to meet professional production standards suitable for customer-facing demos.

---

## 1. Code Quality Standards

### TypeScript Strict Mode

**tsconfig.json** enforces maximum type safety:

```json
{
  "strict": true,
  "strictNullChecks": true,
  "noImplicitAny": true,
  "noUncheckedIndexedAccess": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```

**Zero `any` types permitted.** All API responses and component props have explicit interfaces.

### Type Definitions (`/types/index.ts`)

All domain types are centralized with `readonly` modifiers:

```typescript
export interface Order {
  readonly id: string;
  readonly status: OrderStatus | string;
  readonly client?: Client;
  readonly tasks?: ReadonlyArray<OrderTask>;
  // ...
}
```

---

## 2. Component Architecture

### Atomic Design Pattern

```
/components
├── /ui              # Atoms & Molecules (primitives)
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── skeleton.tsx
│   ├── status-badge.tsx
│   ├── page-header.tsx
│   ├── section.tsx
│   ├── data-table.tsx
│   ├── empty-state.tsx
│   └── error-boundary.tsx
│
├── /features        # Organisms (domain-specific)
│   ├── client-info.tsx
│   ├── task-list.tsx
│   ├── message-list.tsx
│   ├── service-list.tsx
│   ├── line-items-table.tsx
│   ├── order-total.tsx
│   ├── notes-section.tsx
│   ├── order-skeleton.tsx
│   └── proposal-skeleton.tsx
│
├── OrderView.tsx    # Page-level compositions
└── ProposalView.tsx
```

### Single Responsibility Principle

Each component does exactly one thing:

| Component | Responsibility |
|-----------|---------------|
| `StatusBadge` | Render status with appropriate color |
| `ClientInfo` | Display client details section |
| `TaskList` | Render order tasks with status |
| `LineItemsTable` | Display line items with totals |
| `OrderSkeleton` | Loading state for order page |

### React Server Components

- **Default**: All components are Server Components
- **Client Components**: Only for interactivity (`"use client"` directive)
  - `ProposalView.tsx` - Has sign button with onClick handler
  - `ErrorBoundary.tsx` - Requires React class component

---

## 3. Design System

### shadcn/ui Integration

Configured in `components.json`:
- Style: New York
- Base color: Neutral
- CSS Variables: Enabled
- RSC: Enabled

### Semantic Color Tokens (`app/globals.css`)

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --destructive: 0 84.2% 60.2%;
  --border: 0 0% 89.8%;
}
```

### Typography

Inter font family with system fallbacks:
```typescript
fontFamily: {
  sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"]
}
```

### Status Badge Colors

Semantic mapping in `status-badge.tsx`:

| Status | Color |
|--------|-------|
| pending | Warning (amber) |
| in_progress / active | Purple |
| completed / signed | Success (green) |
| cancelled / declined | Destructive (red) |
| confirmed / sent | Info (blue) |

---

## 4. Performance Patterns

### Loading States

Every async route has a `loading.tsx` with skeleton UI:

```
/app/orders/[id]/
├── page.tsx       # Async data fetching
├── loading.tsx    # OrderSkeleton component
└── not-found.tsx  # 404 state
```

Skeletons match the actual content layout to prevent layout shift.

### Suspense Boundaries

```tsx
export default async function OrderPage({ params }) {
  const { id } = await params;
  return (
    <Suspense fallback={<OrderSkeleton />}>
      <OrderContent id={id} />
    </Suspense>
  );
}
```

### Server-Side Data Fetching

All API calls happen on the server:

```typescript
async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    cache: "no-store",
  });
  return response.json() as Promise<T>;
}
```

---

## 5. Error Handling

### API Error Class

```typescript
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}
```

### Error States

- **404 errors**: Redirect to custom `not-found.tsx`
- **Other errors**: Display `EmptyState` with actionable guidance
- **Client errors**: `ErrorBoundary` component with retry action

### User-Friendly Messages

```tsx
<EmptyState
  title="Unable to load order"
  description="We couldn't retrieve this order. Please check the URL or try again later."
  action={{ label: "Go to homepage", href: "/" }}
/>
```

---

## 6. File Structure

```
/
├── /app                    # Next.js App Router
│   ├── layout.tsx          # Root layout with header/footer
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Tailwind + CSS variables
│   ├── /orders/[id]/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│   └── /proposals/[id]/
│       ├── page.tsx
│       ├── loading.tsx
│       └── not-found.tsx
│
├── /components
│   ├── /ui                 # Reusable primitives
│   ├── /features           # Domain components
│   ├── OrderView.tsx
│   └── ProposalView.tsx
│
├── /lib
│   ├── api.ts              # Type-safe API client
│   └── utils.ts            # Shared utilities (cn, formatters)
│
├── /types
│   └── index.ts            # All TypeScript interfaces
│
├── components.json         # shadcn/ui config
├── tailwind.config.ts      # Design tokens
└── tsconfig.json           # Strict TypeScript
```

---

## 7. Utilities (`/lib/utils.ts`)

### Class Name Merging

```typescript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

### Formatting Functions

```typescript
export function formatCurrency(amount: number | undefined | null): string
export function formatDate(dateString: string | undefined | null): string
export function formatDateTime(dateString: string | undefined | null): string
export function formatStatus(status: string): string
```

---

## 8. Accessibility

- Semantic HTML elements (`<header>`, `<main>`, `<footer>`, `<nav>`)
- ARIA labels where needed
- Keyboard navigation support (via Radix UI primitives)
- Color contrast meets WCAG guidelines
- Focus visible states on interactive elements

---

## 9. Adding New Components

### UI Component (Atom)

```typescript
// components/ui/my-component.tsx
import { cn } from "@/lib/utils";

interface MyComponentProps {
  readonly className?: string;
  readonly children: React.ReactNode;
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("base-styles", className)}>
      {children}
    </div>
  );
}
```

### Feature Component (Organism)

```typescript
// components/features/my-feature.tsx
import { Section } from "@/components/ui/section";
import type { MyType } from "@/types";

interface MyFeatureProps {
  readonly data: MyType;
}

export function MyFeature({ data }: MyFeatureProps) {
  return (
    <Section title="My Feature">
      {/* content */}
    </Section>
  );
}
```

---

## 10. Quality Checklist

Before shipping any component:

- [ ] TypeScript strict mode passes
- [ ] No `any` types
- [ ] Props interface uses `readonly`
- [ ] Component has single responsibility
- [ ] Uses design system tokens (not raw colors)
- [ ] Has loading state if async
- [ ] Has error state if can fail
- [ ] Mobile responsive
- [ ] Keyboard accessible

---

## Summary

This refactor transforms the codebase into a production-ready, demo-quality application following industry best practices from Stripe, Linear, and Vercel. The architecture prioritizes:

1. **Type Safety** - Strict TypeScript with no escape hatches
2. **Composability** - Atomic design with reusable primitives
3. **Performance** - Server components, loading skeletons, no layout shift
4. **User Experience** - Clear states, helpful errors, professional polish
5. **Maintainability** - Clear structure, single responsibility, documentation
