# Agent Instructions

## Project Runtime

- The Manifest V3 Chrome extension is built with [WXT](https://wxt.dev). File-based entrypoints live in
  `apps/extensions/src/entrypoints/`: popup, unlisted dashboard page, and `defineBackground` service worker.
- The hosted web app is a Vite SPA (`dev:web` / `build:web`) that always mounts `AppRouter` with
  `BrowserRouter`. Vite options live in `wxt.config.ts`; `vite.config.ts` only forwards them.
- The popup's More Details action opens the packaged `dashboard.html#/dashboard` with `browser.runtime.getURL()`; it
  does not require a hosted web deployment or a `WEB_APP_URL` setting.
- The browser-push control is web-only and is hidden in the extension dashboard.
- Run `pnpm test`, `pnpm typecheck`, and `pnpm build` to validate application changes. Extension tests use Vitest
  and React Testing Library with `WxtVitest`.

## Non-Interactive Shell Commands

**ALWAYS use non-interactive flags** with file operations to avoid hanging on confirmation prompts.

Shell commands like `cp`, `mv`, and `rm` may be aliased to include `-i` (interactive) mode on some systems, causing the agent to hang indefinitely waiting for y/n input.

**Use these forms instead:**
```bash
# Force overwrite without prompting
cp -f source dest           # NOT: cp source dest
mv -f source dest           # NOT: mv source dest
rm -f file                  # NOT: rm file

# For recursive operations
rm -rf directory            # NOT: rm -r directory
cp -rf source dest          # NOT: cp -r source dest
```

**Other commands that may prompt:**
- `scp` - use `-o BatchMode=yes` for non-interactive
- `ssh` - use `-o BatchMode=yes` to fail instead of prompting
- `apt-get` - use `-y` flag
- `brew` - use `HOMEBREW_NO_AUTO_UPDATE=1` env var
