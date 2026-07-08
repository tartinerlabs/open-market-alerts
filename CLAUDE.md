# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fed Open Market Alerts is a React application built with TypeScript and Vite that monitors Federal Reserve
Open Market Operations with automated alerts for new operations. The project can be deployed as both a multi-page
web application (with React Router) and Chrome extension using the @crxjs/vite-plugin. The web application features
a landing page, dashboard, and extension redirect page. The Chrome extension features a dedicated popup
dashboard with user preference management and unread notification badges.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build the project (TypeScript compilation + Vite build)
- `pnpm typecheck` - Type-check the project (`tsc -b`)
- `pnpm lint` - Run Biome linting with automatic fixes
- `pnpm preview` - Preview the production build
- `pnpm release` - Run semantic-release locally (for testing)

Note: This project uses pnpm as the package manager. Node.js 26 is pinned via `.node-version`.

## Code Architecture

### Data Flow

- **Services Layer** (`src/services/`): API integration, notifications, scheduling, and storage management
    - `reverse-repo.ts`: Fed markets API integration
    - `notifications.ts`: Chrome extension notification handling
    - `scheduler.ts`: Automated data check scheduling for weekdays
    - `storage.ts`: Chrome extension storage for timestamp tracking
- **Types** (`src/types/`): TypeScript interfaces for Fed markets API responses and user preferences
- **Components** (`src/components/`): React components with co-located data fetching using TanStack Query
    - `common/`: Shared components (loader, metric-card)
    - `reverse-repo/`: Federal Reserve operations components
    - `settings/`: User preference management components
    - `dashboard/`: Dashboard page component
    - `landing/`: Landing page component
- **UI Components**: HeroUI (@heroui/react + @heroui-pro/react) with React Aria primitives
- **Pages** (`src/pages/`): Page components for different routes
- **Routing** (`src/AppRouter.tsx`): React Router configuration with route definitions
- **Popup Component** (`src/popup.tsx`): Chrome extension popup dashboard with market data and settings
- **Background Script** (`src/background.ts`): Chrome extension service worker for automated notifications

### API Integration

- Base API: `https://markets.newyorkfed.org/api/rp/reverserepo/all/results`
- Primary endpoint: `/lastTwoWeeks.json`
- Data fetching handled by TanStack Query with `useQuery` hooks
- Error handling and loading states managed at component level

### Chrome Extension Configuration

- Manifest V3 extension defined in `manifest.config.ts`
- Host permissions for `markets.newyorkfed.org` and localhost
- Extension popup uses dedicated `popup.tsx` component with market dashboard and settings
- User preference management via `src/components/settings/view.tsx` component
- Unread notification badges on extension icon
- Background service worker (`src/background.ts`) handles scheduled notifications
- Push notifications with chrome.notifications API for new Fed operations

### Notification System

- **Automated Scheduling**: Checks for new Fed data weekdays at 1:20 PM EST
- **Smart Notifications**: Only notifies on actual data changes using timestamp comparison
- **User Preferences**: Configurable notification settings via extension popup
- **Badge Management**: Visual indicators for unread notifications on extension icon
- **Storage Integration**: Tracks last updated timestamps to prevent duplicate notifications
- **Manual Triggers**: Background script supports on-demand data checks via message passing

## Development Patterns

### Component Structure

- **Routing**: React Router with multi-page web application support
    - Landing page (`/`) with features overview and latest data preview
    - Dashboard page (`/dashboard`) with full market data and trends
    - Extension redirect page (`/extension`) for Chrome Web Store
- **SEO**: React Helmet Async for dynamic meta tags and page titles
- **Data Fetching**: Components use TanStack Query for API integration
- **UI Patterns**: Loading and error states handled with reusable `<Loader>` and `<Alert>` components
- **Shared Components**: Metric cards and data tables follow established patterns
- **Chrome Extension**: Popup (`popup.tsx`) provides dashboard with market data and settings access
- **Settings Management**: Dedicated `src/components/settings/view.tsx` component with preference controls

### Styling

- Tailwind CSS for styling with custom configuration
- UI components from HeroUI library (@heroui/react, @heroui-pro/react)
- Responsive design patterns (mobile-first grid layouts)
- Gradient backgrounds and modern card layouts
- Chrome Web Store badge integration

### Type Safety

- Strict TypeScript configuration with path aliasing (`@/` for src)
- Comprehensive types for Fed markets API responses
- Component props and state properly typed

## Code Quality

### Linting & Formatting

- Biome for linting and formatting (replaces ESLint/Prettier)
- Double quotes for JavaScript/TypeScript
- Space indentation
- Automatic import organization
- UI components and utility files excluded from linting

### File Organization

- Services contain pure functions for API calls
- Components organized by feature in dedicated folders:
    - `common/`: Shared components (loader, metric-card)
    - `reverse-repo/`: Federal Reserve operations components
    - `settings/`: User preference management components
- Types mirror API response structure

## Commit Conventions & Release Management

### Conventional Commits

This project uses [Conventional Commits](https://conventionalcommits.org/) with automated semantic versioning:

**Commit Format:**

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Commit Types:**

- `feat:` - New features (triggers minor version bump)
- `fix:` - Bug fixes (triggers patch version bump)
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring without feature changes
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks, dependency updates
- `ci:` - CI/CD configuration changes

**Examples:**

```bash
feat(reverse-repo): add real-time data updates
fix(charts): resolve tooltip positioning issue
docs: update API integration guide
chore(deps): update @tanstack/react-query to v5.85.6
```

**Breaking Changes:**

- Add `!` after type: `feat!: redesign API response structure`
- Or include `BREAKING CHANGE:` in commit footer

### Automated Releases

- **Main Branch:** Produces prerelease versions (e.g., `1.0.0-beta.1`, `1.0.0-beta.2`)
- **Releases:** Triggered automatically on push to main via GitHub Actions
- **Version Control:** Managed by semantic-release based on commit messages
- **Git Hooks:** Commitlint validates commit messages before commit

**Release Process:**

1. Make changes following conventional commit format
2. Push to main branch
3. GitHub Actions runs tests, linting, build, and semantic-release
4. New version published with auto-generated changelog and GitHub release

## Build Process

The build process creates both web and extension builds:

1. TypeScript compilation (`tsc -b`)
2. Vite build with React and Tailwind plugins
3. Chrome extension manifest generation via @crxjs/vite-plugin

## Claude-Specific Instructions

- When creating git commits, use short commit messages (title only) without detailed descriptions
- Follow the conventional commit format but keep messages concise

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:970c3bf2 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Agent Context Profiles

The managed Beads block is task-tracking guidance, not permission to override repository, user, or orchestrator instructions.

- **Conservative (default)**: Use `bd` for task tracking. Do not run git commits, git pushes, or Dolt remote sync unless explicitly asked. At handoff, report changed files, validation, and suggested next commands.
- **Minimal**: Keep tool instruction files as pointers to `bd prime`; use the same conservative git policy unless active instructions say otherwise.
- **Team-maintainer**: Only when the repository explicitly opts in, agents may close beads, run quality gates, commit, and push as part of session close. A current "do not commit" or "do not push" instruction still wins.

## Session Completion

This protocol applies when ending a Beads implementation workflow. It is subordinate to explicit user, repository, and orchestrator instructions.

1. **File issues for remaining work** - Create beads for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Handle git/sync by active profile**:
   ```bash
   # Conservative/minimal/default: report status and proposed commands; wait for approval.
   git status

   # Team-maintainer opt-in only, unless current instructions forbid it:
   git pull --rebase
   bd dolt push
   git push
   git status
   ```
5. **Hand off** - Summarize changes, validation, issue status, and any blocked sync/commit/push step

**Critical rules:**
- Explicit user or orchestrator instructions override this Beads block.
- Do not commit or push without clear authority from the active profile or the current user request.
- If a required sync or push is blocked, stop and report the exact command and error.
<!-- END BEADS INTEGRATION -->
