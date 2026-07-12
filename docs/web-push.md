# Web Push Deployment

The web dashboard uses Vercel Functions, Vercel Cron, and Neon Postgres. The
Chrome extension notification flow does not use these settings.

## Provision Neon

1. Create a Neon Postgres database through Vercel Marketplace.
2. Run [`db/migrations/001_web_push.sql`](../db/migrations/001_web_push.sql)
   in the Neon SQL Editor.
3. Add the Neon connection string to Vercel as `DATABASE_URL` for Production,
   Preview, and Development.

## Configure Vercel

Keep the Vercel project rooted at this repository. Its configuration runs the
web build, serves `apps/extensions/dist`, and invokes the weekday cron route.

Generate the VAPID keys once, then retain them for the lifetime of the
application:

```sh
pnpm exec web-push generate-vapid-keys --json
```

Add these Vercel environment variables without committing their values:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string |
| `VAPID_PUBLIC_KEY` | Generated VAPID public key |
| `VAPID_PRIVATE_KEY` | Generated VAPID private key |
| `VAPID_SUBJECT` | `mailto:` address or HTTPS contact URL |
| `CRON_SECRET` | Random secret with at least 16 characters |

Deploy the production branch. Vercel calls
`/api/cron/send-push-alerts` every weekday at 17:20 UTC. Check the Function
logs after the next Fed operation to confirm that subscriptions are delivered.

## Local web build

Use the web-specific commands when reviewing the dashboard outside the Chrome
extension:

```sh
pnpm --filter @tartinerlabs/extensions dev:web
pnpm --filter @tartinerlabs/extensions build:web
```
