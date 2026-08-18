<div align="center">
  <img src="public/icon.svg" alt="Fed Open Market Alerts Logo" width="120" height="120">
</div>

# Fed Open Market Alerts

A React application that monitors Federal Reserve Open Market Operations with automated alerts for new operations.
Built with TypeScript and Vite, deployable as both a multi-page web application and Chrome extension. The web
application
features a landing page, dashboard, and extension redirect page with React Router. The Chrome extension includes a
dedicated
popup dashboard with user preference management.

![Chrome Web Store Badge](public/chrome-web-store-badge.png)

## Features

- **Multi-Page Web App**: Landing page, dashboard, and extension redirect with React Router
- **Real-time Market Data**: Monitor Federal Reserve Open Market Operations
- **Landing Page**: Educational content, features overview, and latest data preview
- **Push Notifications**: Automated alerts for new Fed operations (Chrome extension)
- **User Preferences**: Configurable notification settings via Chrome extension popup
- **Notification Badges**: Visual indicators for unread notifications on extension icon
- **Popup Dashboard**: Dedicated Chrome extension popup with market data and settings
- **Smart Scheduling**: Checks for updates weekdays at 1:20 PM EST when new Fed operations are published
- **Data Visualization**: Interactive charts and tables for Fed operations data
- **SEO Optimized**: Dynamic meta tags and page titles with React Helmet Async
- **Dual Deployment**: Web application and Chrome extension support
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type-Safe**: Built with TypeScript for reliability

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Routing**: React Router DOM for multi-page web application
- **SEO**: React Helmet Async for dynamic meta tags
- **Build Tool**: Vite with hot module replacement
- **Data Fetching**: TanStack Query for efficient API management
- **UI Components**: HeroUI (@heroui/react + @heroui-pro/react) with React Aria primitives
- **Charts**: Recharts for data visualization
- **Package Manager**: pnpm
- **Code Quality**: Biome for linting and formatting
- **Extension**: Chrome Manifest V3 with WXT (`wxt` + `@wxt-dev/module-react`)

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/) (package manager)
- Node.js 26+

### Installation

```bash
# Clone the repository
git clone https://github.com/tartinerlabs/open-market-alerts.git
cd open-market-alerts

# Install dependencies
pnpm install
```

### Development

```bash
# Start the WXT extension dev server
pnpm dev

# Start the web SPA (Vercel/local dashboard)
pnpm --filter @tartinerlabs/extensions dev:web

# Run linting with automatic fixes
pnpm lint

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run semantic-release locally (for testing)
pnpm release
```

The web SPA is available at `http://localhost:5173` when using `dev:web`. `pnpm dev` runs the WXT extension
developer workflow.

## Project Structure

```
apps/extensions/
├── wxt.config.ts            # WXT extension build
├── vite.web.config.ts       # Vite SPA / Vercel web build
├── src/
│   ├── entrypoints/         # WXT popup, dashboard, background
│   ├── components/          # React components
│   │   ├── common/          # Shared components (loader, metric-card)
│   │   ├── dashboard/       # Dashboard page component
│   │   ├── landing/         # Landing page component
│   │   ├── reverse-repo/    # Federal Reserve operations components
│   │   ├── settings/        # User preference management components
│   │   └── layout/          # Shared layout components
│   ├── pages/               # Page components for routing
│   │   └── extension.tsx    # Chrome Web Store redirect page
│   ├── services/            # API integration and extension services
│   │   ├── reverse-repo.ts  # Fed markets API integration
│   │   ├── notifications.ts # Extension notifications
│   │   ├── scheduler.ts     # Automated data check scheduling
│   │   └── storage.ts       # Extension storage management
│   ├── types/               # TypeScript type definitions
│   ├── AppRouter.tsx        # React Router configuration
│   ├── popup.tsx            # Chrome extension popup dashboard
│   └── main.tsx             # Web SPA entry (BrowserRouter)
```

## API Integration

The application fetches data from the New York Federal Reserve Open Market Operations API:

- **Base URL**: `https://markets.newyorkfed.org/api/rp/reverserepo/all/results`
- **Primary Endpoint**: `/lastTwoWeeks.json`
- **Data Handling**: TanStack Query with automatic caching and error handling

## Chrome Extension

The project includes Chrome extension support with automated notifications and user management:

- **Manifest**: V3 extension defined in `wxt.config.ts` plus file-based entrypoints
- **Permissions**: Access to `markets.newyorkfed.org`, localhost, and notifications
- **Popup Dashboard**: Dedicated `popup.tsx` component with market data and settings access
- **User Preferences**: Configurable settings via `src/components/settings/view.tsx` component
- **Notification Badges**: Visual indicators for unread notifications on extension icon
- **Background Worker**: Handles scheduled data checks and notifications
- **Smart Notifications**: Only alerts when new operations are published, scheduled weekdays at 1:20 PM EST

### Extension Features

- **Popup Dashboard**: Interactive dashboard showing market data directly in extension popup
- **User Preferences**: Settings interface for customizing notification preferences
- **Badge Notifications**: Unread notification count displayed on extension icon
- **Automated Monitoring**: Background service checks for new Fed operations on weekdays
- **Push Notifications**: Chrome native notifications when new operations are published
- **Data Persistence**: Tracks operation timestamps to prevent duplicate alerts
- **Manual Triggers**: Support for on-demand operation checks via extension messaging

To load the extension in development:

1. Run `pnpm build`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select `apps/extensions/.output/chrome-mv3`

## Development Patterns

### Component Architecture

- **Multi-Page Application**: React Router with distinct pages:
    - Landing page (`/`) with features overview and latest data preview
    - Dashboard page (`/dashboard`) with full market data and trends
    - Extension redirect page (`/extension`) for Chrome Web Store
- **SEO Integration**: React Helmet Async for dynamic page titles and meta tags
- **Data Fetching**: Components use TanStack Query hooks for API integration
- **UI Patterns**: Loading states handled with reusable `<Loader>` components
- **Error Handling**: Consistent error handling with `<Alert>` components
- **Shared Components**: Metric cards and data tables follow established patterns
- **Chrome Extension**: Popup (`popup.tsx`) provides dashboard with market data and settings access
- **Settings Management**: Dedicated `src/components/settings/view.tsx` component with preference controls

### Code Quality

- Strict TypeScript configuration with path aliasing (`@/` for src)
- Biome for consistent linting and formatting
- Double quotes and space indentation
- Automatic import organization

## Build Process

The repo produces two production outputs:

1. Extension: `pnpm build` → WXT writes `.output/chrome-mv3`
2. Web SPA: `pnpm --filter @tartinerlabs/extensions build:web` → Vite writes `apps/extensions/dist` (Vercel)

## Contributing

### Commit Conventions

This project uses [Conventional Commits](https://conventionalcommits.org/) with automated semantic versioning:

**Commit Format:**

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Common Types:**

- `feat:` - New features (triggers minor version bump)
- `fix:` - Bug fixes (triggers patch version bump)
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring without feature changes
- `chore:` - Maintenance tasks, dependency updates
- `ci:` - CI/CD configuration changes

**Examples:**

```bash
feat(reverse-repo): add real-time data updates
fix(charts): resolve tooltip positioning issue
docs: update README installation guide
chore(deps): update react to v19.1.2
```

### Development Guidelines

1. Follow the existing code patterns and conventions
2. Use the established component structure
3. Ensure TypeScript types are properly defined
4. Write commit messages following conventional commit format
5. Run `pnpm lint` before committing
6. Test both web and extension builds

### Release Process

- **Automated Releases**: Triggered on push to main branch via GitHub Actions
- **Prerelease Versions**: Main branch produces beta versions (e.g., `1.0.0-beta.1`)
- **Version Control**: Managed by semantic-release based on commit messages
- **Git Hooks**: Commitlint validates commit messages before commit

## License

[MIT](LICENSE)