@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fed Open Market Alerts monitors the New York Fed's reverse-repo operations and alerts on new data. A single
Vite bundle serves a multi-page React Router web app and a Manifest V3 Chrome extension built via
`@crxjs/vite-plugin`. The extension uses the same bundle for its hashless popup, hash-routed full-page dashboard,
and background service worker. `main.tsx` picks the UI mode at runtime — no separate build targets.

## Monorepo Layout

pnpm workspaces + Turborepo. The root package (`fed-open-market-alerts`) holds tooling only; all application
code lives in `apps/extensions/` (package `@tartinerlabs/extensions`). `packages/` is currently empty.

- Root scripts delegate to `turbo run <task>`; `turbo.json` sets `envMode: strict`.
- App code: `apps/extensions/src/`. Paths below are relative to there unless noted.

## Development Commands

Run from the repo root:

- `pnpm dev` — `turbo run dev` → `vite` (dev server + extension HMR)
- `pnpm build` — `turbo run build` → `vite build` (produces the MV3 extension via crxjs)
- `pnpm typecheck` — API `tsc`, then `turbo run typecheck` → extension `tsc --noEmit` (no project references)
- `pnpm test` — API Vitest suite, then the extension's colocated Vitest/React Testing Library tests
- `pnpm preview` — `turbo run preview` → `vite preview`
- `pnpm lint` — `biome check --write .` (lint + format with autofix, run at root, not via turbo)
- `pnpm release` — `semantic-release` (normally CI-only)

Node 26 (`.node-version`, `devEngines.runtime ^26.0.0`); pnpm `11.10.0` (`packageManager`).

## Architecture

### Dual runtime mode

`main.tsx` calls `isExtensionPopup()`. A hashless `chrome-extension:` page with `chrome.runtime.id` renders `Popup`;
an extension URL whose hash starts with `#/` renders `AppRouter` with `HashRouter`; normal HTTP(S) pages render
`AppRouter` with `BrowserRouter`. The popup's More Details action opens the packaged `index.html#/dashboard` via
`chrome.runtime.getURL()`. A single `QueryClient` is created in `main.tsx` and provided to both surfaces.

### Services (`services/`)

Pure/side-effecting modules the popup, web app, and background worker share:

- `reverse-repo.ts` — Fed data. `FED_MARKETS_API_BASE = https://markets.newyorkfed.org/api/rp/reverserepo/all/results`;
  `getLastTwoWeeks()` fetches `/lastTwoWeeks.json`. Helpers `getLatestReverseRepo()` / `getRecentReverseRepoTrend()`.
  Plain `fetch`, no auth.
- `scheduler.ts` — `chrome.alarms` scheduling. `SCHEDULE_CONFIG` = `CHECK_HOUR: 13`, `CHECK_MINUTE: 20`,
  `EST_UTC_OFFSET: -5`; `isWeekday()` gates Mon–Fri; `scheduleNextFedDataCheck()` creates the `fedDataCheck` alarm.
- `notifications.ts` — builds/shows `chrome.notifications`; includes a test-operation builder for the settings panel.
- `storage.ts` — wraps `chrome.storage.local`. Keys: `last_updated_timestamp`, `has_unread_notification`,
  `user_preferences`.

### Background worker (`background.ts`, MV3 service worker)

`checkFedData()` fetches the latest operation and compares `lastUpdated` against the stored timestamp; on change it
notifies **only if** `preferences.notificationsEnabled && preferences.immediateNotifications`, then stores the new
timestamp and sets the unread flag. `updateBadge()` shows a red "!" badge when unread. Listeners: `onStartup` /
`onInstalled` (schedule + badge), `alarms.onAlarm` (check + reschedule), `runtime.onMessage` for
`{action: "checkFedDataNow"}` (manual check), `storage.onChanged` (refresh badge).

### Data fetching

Components call TanStack Query's `useQuery` directly with the service functions as `queryFn` — there is no custom-hook
layer. Query keys in use: `["latest-reverse-repo"]`, `["reverse-repo-trend"]`, `["user-preferences"]`. Settings
(`settings/view.tsx`) write preferences via the storage service then `queryClient.setQueryData(["user-preferences"], …)`
(cache-write, not `useMutation`), gated with `enabled: typeof chrome !== "undefined" && !!chrome.storage`.

Chrome API guards live at the call sites (`main.tsx`, popup, settings); the service modules call `chrome.*` unguarded
by design, since they're only reached from popup/settings/background contexts.

### Routing & config

- Routes (`AppRouter.tsx`): `/` (Landing), `/dashboard`, `/extension`, `/privacy-policy`, `/terms-of-service`,
  `/contact`. Browser builds use history paths; extension pages use hash paths. SEO via React Helmet Async. The
  web-only browser-push control is hidden in the extension dashboard.
- `config/index.ts` exposes `EXTENSION_*` from `import.meta.env`. `vite.config.ts` sets custom `manualChunks`
  (charts, heroui, tanstack, motion, react-vendor, vendor).
- `manifest.config.ts` (crxjs): MV3, `permissions: [notifications, alarms, storage]`, `host_permissions:
  [markets.newyorkfed.org, localhost]`, `background.service_worker: src/background.ts`.

## Tooling & Conventions

- **Biome** (`biome.json`): recommended rules, double quotes, space indent, organize-imports on; excludes `**/dist`
  and `**/*.svg`; uses `.gitignore` via VCS integration.
- **TypeScript**: strict, `verbatimModuleSyntax`, path alias `@/* → apps/extensions/src/*`.
- **UI**: HeroUI v3 (`@heroui/react` + `@heroui-pro/react`) on Tailwind CSS v4 (no v3). v3 uses compound components
  (e.g. `Sheet.Trigger`) and `onPress` (not `onClick`); no Provider needed.
- **Commits & releases**: Conventional Commits + semantic-release. `main` produces beta prereleases. When creating
  commits, use short title-only messages (no body). Keep `conventional-changelog-conventionalcommits` pinned to
  `8.0.0` — 9.x/10.x break semantic-release notes.

## CI

`.github/workflows/release.yml` runs on push to `main`: a `checks` job (`biome ci .` + `pnpm typecheck` in parallel),
then a `release` job (`pnpm build` + `pnpm release`). All actions are SHA-pinned; installs need the
`HEROUI_AUTH_TOKEN` secret.

## Gotchas

- **DST**: `scheduler.ts` hardcodes `EST_UTC_OFFSET: -5` with no daylight-saving handling, so the "1:20 PM EST" check
  actually fires an hour off in summer (EDT).
- **`dailySummary`**: exists in `types/preferences.ts` and the settings UI but has **no implementing logic** in
  `background.ts` — only `immediateNotifications` gates notifications. The setting is currently non-functional.
- **`App.tsx`**: dead/legacy — not imported anywhere (`main.tsx` renders `Popup`/`AppRouter`; `Dashboard` renders
  `Latest`/`Trend` itself).

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
