# Session State - Service Engine X Frontend

**Last Updated:** 2026-02-08
**Last Editor:** Claude (Opus 4.5)

## Project Overview

Customer-facing portal for Service Engine X - a B2B platform where service providers (like Revenue Activation, Outbound Solutions) manage client engagements. This frontend is what the **end customer** sees - not the service provider's admin interface.

### Key Concept: White-Label SaaS

Service Engine X is invisible to end customers. The portal displays as the service provider's brand:
- `client.revenueactivation.com` → Shows "Revenue Activation" branding
- `client.outboundsolutions.com` → Shows "Outbound Solutions" branding
- Default → Shows "Service Engine" (fallback only)

## Tech Stack

- **Framework:** Next.js 15.5.12 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Deployment:** Vercel
- **API:** Service Engine X API at `api.serviceengine.xyz`

## Current State

### What's Working
- Domain-based branding (name, initial, support email)
- Engagement/Project data model with 6-phase lifecycle
- Dashboard with active project display
- Messages page with conversations grouped by project
- Onboarding section with phase-specific next actions
- Project cards with phase progress visualization

### Recent Changes (2026-02-08)

1. **Engagement/Project Model** - Replaced "orders" concept with engagement → project hierarchy
2. **6-Phase Project Lifecycle:** Kickoff → Setup → Build → Testing → Deployment → Handoff
3. **Domain-Based Branding** - `lib/branding.ts` detects domain and returns org-specific branding
4. **Dynamic Metadata** - Page titles use org name from domain
5. **Org-Specific Support Emails** - `team@revenueactivation.com`, `team@outboundsolutions.com`
6. **Removed Exclamation Points** - Per user preference, no `!` in UI copy

## Architecture

### Route Structure
```
app/
├── layout.tsx                 # Root layout, dynamic metadata
├── (dashboard)/              # Route group with sidebar
│   ├── layout.tsx            # Sidebar + main content wrapper
│   ├── page.tsx              # Dashboard (active project, activity, conversations)
│   ├── messages/page.tsx     # Conversations grouped by project
│   ├── settings/page.tsx     # Account settings
│   └── tasks/page.tsx        # Task list
```

### Key Files

| File | Purpose |
|------|---------|
| `lib/branding.ts` | Domain detection → org branding (name, initial, supportEmail) |
| `lib/api.ts` | API client for Service Engine X backend |
| `types/index.ts` | TypeScript types, includes `PROJECT_PHASES` constant |
| `components/layout/sidebar.tsx` | Left nav with dynamic branding |
| `components/features/project-card.tsx` | Project display with phase progress |
| `components/features/onboarding-section.tsx` | Phase-specific next actions for clients |

### Branding System

```typescript
// lib/branding.ts
getBrandingFromDomain(hostname: string): Branding

// Returns:
{
  name: string;        // "Revenue Activation"
  initial: string;     // "R"
  supportEmail: string; // "team@revenueactivation.com"
}
```

Detection logic:
- Domain includes "revenueactivation" → Revenue Activation
- Domain includes "outboundsolutions" → Outbound Solutions
- Default → Service Engine

### Data Model

```
Engagement (client relationship)
└── Project (specific work item)
    ├── phase: Kickoff | Setup | Build | Testing | Deployment | Handoff
    ├── phaseId: 1-6
    └── Conversations
        └── Messages
```

### API Configuration

```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.serviceengine.xyz
API_TOKEN=<bearer token for authenticated requests>
```

**Important:** `API_TOKEN` must be set in Vercel environment variables for production.

## Deployment

### Vercel Setup
- Project: `bencranes-projects/service-engine-x-frontend`
- Framework: Next.js (auto-detected)
- Build: `npm run build`
- Output: `.next`

### Deploy Commands
```bash
# Always verify clean state first
git status
git diff --stat

# Deploy
git push origin main
vercel --prod --yes
```

### Custom Domains
- `client.revenueactivation.com` - Revenue Activation customers
- `client.outboundsolutions.com` - Outbound Solutions customers

## Test Credentials

**Acme Corporation** (test client):
- API: `api.serviceengine.xyz`
- Used for development/testing

## Known Issues / TODOs

1. **Projects Page** - `/projects/[id]` route exists but needs implementation
2. **Task Actions** - Task CTAs link to non-existent task detail pages
3. **Real-time Updates** - No websocket/polling for live updates yet
4. **Mobile Sidebar** - Needs collapsible/hamburger menu for mobile

## Style Guidelines

- No exclamation points in UI copy
- No emojis unless explicitly requested
- Muted, professional tone
- Dark mode by default (`<html className="dark">`)

## Post-Mortems

See `docs/postmortems/` for incident documentation:
- `2026-02-08-uncommitted-fix.md` - Build failure from uncommitted local changes

## Git Workflow

Before every deploy:
```bash
git status                  # Check for uncommitted files
git diff --stat             # See what's different
npm run build               # Verify build passes locally
git add <specific files>    # Stage (avoid git add -A)
git commit -m "message"     # Commit
git status                  # Confirm clean
git push origin main        # Push
vercel --prod --yes         # Deploy
```

**Never assume local build success means CI will pass.** Always verify git state.
