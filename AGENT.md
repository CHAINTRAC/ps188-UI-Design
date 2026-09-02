# AGENT.md — ps188-ui

Scoped guidance for working inside this repo. Think before coding, keep changes surgical, don't
redesign or restructure something you weren't asked to touch.

## Read this first

- `FRONTEND_GUIDE.md` — the style bible. Architecture flow (UI → hooks → services → `lib/api.js` →
  REST API), why TanStack Query + Zustand instead of Redux, folder structure, the
  services/hooks split per feature, styling tokens, the "what NOT to do" list (§9).

## Quick facts

- Plain JavaScript, Vite + React, `react-router-dom`. No TypeScript, no Next.js.
- **TanStack Query for server data, Zustand for the two tokens, React Context only for theme.**
  Not Redux, not one big auth Context — see `FRONTEND_GUIDE.md` §1.2 for why they're split this way.
- Auth tokens live in `localStorage` via a persisted Zustand store (`store/authStore.js`) — the
  backend returns `access_token`/`refresh_token` in the JSON body, not an httpOnly cookie. Read
  them only through `useAuthStore`, never re-read `localStorage` directly elsewhere.
- One axios instance, `lib/api.js` — every request and the token-refresh interceptor go through it.
  Never create a second instance, never call `fetch`/raw `axios` for a backend call.
- No Zod — plain JS project. Services unwrap `res.data.data` and let a bad shape throw naturally;
  don't add a validation layer that assumes TypeScript inference.
- Every feature that talks to the backend gets `features/<name>/services.js` (plain async
  functions) + `features/<name>/hooks.js` (the Query/Mutation wrappers) — two files, not one.
- `data/*.js` files are pre-backend mock scaffolding. When a screen gets wired to a real endpoint,
  delete its mock file in the same change — don't leave both.
- **Don't add comments unless the WHY is genuinely non-obvious** — a hidden constraint, a workaround,
  something that would surprise a reader. One line, at most. Never restate what the code already
  says, never a comment block explaining a function's own name. If you'd remove it without
  confusing anyone, don't write it.

## Before wiring a new screen to a real endpoint

Check `ps188-backend/internal/transport/http/router.go` for the actual route and method — don't
guess a shape from the mock data in `data/*.js`. If the endpoint doesn't exist yet, that's a
question for the user, not something to stub and move on from silently.
