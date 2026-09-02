# Sentinel Frontend Guide

**(React + Vite · JS · react-router-dom · TanStack Query · Zustand · Tailwind v4)**

> This defines how frontend code in `ps188-ui` should be written. It's adapted from a
> Next.js/TS/Zod/Redux reference we were handed — the principles are worth keeping,
> the stack-specific parts are not, so this rewrites it against what we actually use.
> Permanent reference — for whoever touches this repo next, human or AI.

---

## 1. Core Principles

### 1.1 Architecture Flow

```
UI (pages/components)  →  Hooks  →  Services  →  api.js (axios)  →  REST API
```

- **UI never imports `api.js` or a service function directly** — only hooks
- **Hooks never return JSX**
- **Services are plain async functions** — no hooks, no component state, just "call the API, return/throw"
- No Zod here (plain JS, no TS to infer into) — services trust the backend's documented response envelope. `ps188-backend` always returns `{success, data, message}` or `{success:false, error:{code, message}}` (see `internal/response/response.go`), so a service's job is just to unwrap `res.data.data` and let a bad shape throw naturally rather than silently pass through.

### 1.2 State Ownership

| State type | Tool | Example |
|---|---|---|
| Server data (from API) | TanStack Query | screenings, verifiers, checkpoints, blacklist entries |
| Auth tokens | Zustand, persisted (`store/authStore.js`) | `accessToken`, `refreshToken` |
| Theme | React Context (`context/ThemeContext.jsx`) | light/dark — rarely changes, purely presentational |
| Global UI-only state | Zustand | a sidebar or modal shared across distant components, if that ever comes up |
| Local component state | `useState` | input value, dropdown open, form fields |

**Never put API data in Zustand. Never use TanStack Query for UI-only state.**

Auth is the one deliberate exception to "server data → Query only": the **tokens** live in Zustand, not Context, because the axios interceptor in `lib/api.js` needs to read and write them from outside the React tree (`useAuthStore.getState()`) — Context can't be reached there. The **user profile**, though, is server data and does live in Query (`useMe`, keyed `["me"]`). Don't collapse these back into one "auth state" blob — they're different lifetimes for a reason.

---

## 2. Folder Structure

```
src/
├── main.jsx                    # mounts QueryClientProvider
├── App.jsx                     # all routes (react-router-dom — not file-based, unlike Next)
│
├── pages/                      # route components — compose, never build reusable UI
│   ├── verifier/
│   ├── admin/
│   ├── superadmin/
│   └── Landing.jsx, SignIn.jsx, Profile.jsx
│
├── features/                   # one folder per real feature — grows as endpoints land
│   └── auth/
│       ├── services.js         # loginRequest, fetchMe — plain functions, call `api`
│       └── hooks.js            # useLogin, useMe, useLogout
│
├── components/
│   ├── ui/                     # atoms — Card, Badge, RiskGauge, ThemeToggle
│   ├── layout/                 # molecules — HeaderShell, Topbar
│   ├── auth/                   # AuthBoot, RequireRole — route guards, not a "feature"
│   └── verifier/, landing/, superadmin/...  # composed feature-scoped UI, no hooks of their own yet
│
├── store/                      # Zustand — non-server global state only
│   └── authStore.js
│
├── lib/                        # framework-agnostic helpers, no JSX
│   ├── api.js                  # THE ONE axios instance — see §4
│   ├── queryClient.js
│   └── format.js
│
├── context/
│   └── ThemeContext.jsx
│
├── config/
│   └── roles.js                 # nav structure per role — static config, not server data
│
└── data/                        # DEMO-ONLY mock data, predates the backend
    └── verifierScenarios.js, superAdminData.js, ...
```

**On `data/`:** these files are scaffolding from before `ps188-backend` existed. As each page gets wired to a real endpoint, delete its mock file — don't keep it "just in case." A mock and a real data source for the same screen should never coexist past the PR that wires the real one in.

**`features/`:** `auth` is the first feature built this way — `services.js` (plain functions) and `hooks.js` (the Query/Mutation wrappers) as two files, not one. Every feature that talks to the backend from here on (screenings, blacklist, verifiers, checkpoints) follows the same shape from the start.

---

## 3. Component Tiers

Same idea as atomic design, mapped onto what's already here:

| Tier | Where | Rule |
|---|---|---|
| **Atom** | `components/ui/` | No hooks, no domain meaning (`Badge`, not `VerdictBadge`), reusable anywhere |
| **Molecule** | `components/layout/`, one-off composed pieces | Takes props, renders; local `useState` for pure UI only (open/closed, hover) — no data fetching |
| **Organism** | anywhere a feature hook is called | Uses `useMe`/`useScreenings`/etc., owns loading/empty/error states, never calls `api.js` or a service directly |
| **Page** | `src/pages/**/*.jsx` | Composes organisms, reads route params via `react-router-dom`, contains no reusable UI of its own |

> **Needs a hook → organism. No hook needed → molecule.**

---

## 4. API Client — `lib/api.js`

Already built. One axios instance (`api`), everything else imports it — nobody else calls `axios` or `fetch` directly.

- **Request interceptor**: attaches `Authorization: Bearer <accessToken>` from `useAuthStore.getState()`
- **Response interceptor**: on `401` with error code `20003` (token expired), does a **single-flight** refresh (concurrent 401s share one refresh call, not five) via `POST /auth/refresh-token`, retries the original request once. On refresh failure, or any other `401`, clears tokens and hard-redirects to `/login`. `/auth/*` endpoints themselves are exempt from this — a failed login must surface to the login form, not trigger a logout redirect.

Don't add a second axios instance for a new feature. Don't reach for `fetch` because axios "feels heavy" for one call — the interceptor logic only protects you if every request goes through it.

---

## 5. Services + Hooks (per feature, going forward)

**`features/<name>/services.js`** — plain async functions:

```js
// features/blacklist/services.js
import { api } from "../../lib/api";

export async function checkBlacklist(docNumber) {
  const res = await api.get("/blacklist/check", { params: { doc_number: docNumber } });
  return res.data.data;
}

export async function createBlacklistEntry(payload) {
  const res = await api.post("/blacklist", payload);
  return res.data.data;
}
```

**`features/<name>/hooks.js`** — the Query/Mutation wrappers, this is what components import:

```js
// features/blacklist/hooks.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkBlacklist, createBlacklistEntry } from "./services";

export function useBlacklistCheck(docNumber) {
  return useQuery({
    queryKey: ["blacklist", "check", docNumber],
    queryFn: () => checkBlacklist(docNumber),
    enabled: !!docNumber,
  });
}

export function useCreateBlacklistEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlacklistEntry,
    onSuccess: (entry) => {
      // patch the cached list directly — skip the refetch when the response already has what we need
      queryClient.setQueryData(["blacklist", "list"], (old = []) => [entry, ...old]);
    },
  });
}
```

Rules:
- Prefer `queryClient.setQueryData` over `invalidateQueries` whenever the mutation response already contains the updated/created record — `invalidateQueries` costs a network round-trip the response already made unnecessary.
- Every hook that returns a list defaults it to `[]`, never `undefined` — components should never need to null-check before `.map()`.
- Name mutations as verbs (`createVerifier`, not `mutate`), matching how `useLogin`/`useMe`/`useLogout` are already named.

---

## 6. Styling

What's already enforced, made explicit:

- **Colors always come from the token set in `src/index.css`'s `@theme` block** (`bg-surface`, `text-ink-dim`, `bg-good-soft`, `border-line`, …). Never a raw hex or `oklch()` value inside a component — if a color you need doesn't have a token yet, add it to `@theme` (and its dark-mode override under `:root.dark`), don't inline it.
- **Text sizes are an intentional fine-grained arbitrary scale** (`text-[11px]`, `text-[12.5px]`, `text-[13.5px]`, …), not Tailwind's default steps. That's a deliberate choice for this dense dashboard aesthetic — don't "fix" it by swapping to `text-sm`/`text-base`. Do stay within sizes already used elsewhere on the same page rather than inventing a new one-off value.
- **No inline `style={{}}`** except for values genuinely computed at runtime — animated widths/transforms via Framer Motion, SVG coordinates, a dynamic `translateX`. Anything static goes through Tailwind classes.
- `cn()`-style class merging isn't in use here yet (template strings + ternaries are, e.g. `` `flex ... ${active ? "text-ink" : "text-ink-faint"}` ``) — keep that pattern rather than introducing `clsx`/`tailwind-merge` for its own sake.

---

## 7. Auth (current implementation)

- `store/authStore.js` — Zustand, persisted to `localStorage` under `sentinel-auth`, holds only `accessToken`/`refreshToken`.
- `lib/api.js` — reads/writes those tokens directly (see §4).
- `features/auth/services.js` — `loginRequest`, `fetchMe`, plain functions calling `api`.
- `features/auth/hooks.js` — `useLogin` (calls `loginRequest`, seeds `["me"]` in the Query cache from the response), `useMe` (calls `fetchMe`, the "who am I" check — used both on app boot and anywhere the live user is needed), `useLogout` (clears tokens + clears the Query cache).
- `components/auth/AuthBoot.jsx` — gates the whole route tree on first paint: if a token survived from a previous session, waits on `useMe` before rendering anything.
- `components/auth/RequireRole.jsx` — per-route-group guard, reads the already-resolved `useMe` result (never triggers its own fetch), redirects to `/login` on missing auth or wrong role.

This is a working reference for how a feature's auth-adjacent state should be split across Zustand/Query/Context — point back to it rather than re-deriving the pattern from scratch for the next feature that touches sessions.

---

## 8. Decision Cheatsheet

| Question | Answer |
|---|---|
| Pure UI primitive, no domain meaning? | Atom — `components/ui/` |
| One domain thing, no hook needed? | Molecule |
| Needs a hook (data, async, business logic)? | Organism |
| Route-level, composes organisms? | Page — `src/pages/` |
| Server data (from the API)? | TanStack Query |
| Tokens the axios interceptor needs outside React? | Zustand |
| Rarely-changing, purely presentational (theme)? | React Context |
| Local toggle/value? | `useState` |
| Calls the API? | Service function, called only from a hook |

---

## 9. What NOT to Do

- API calls or service functions directly in a component or page — always through a hook
- A hook that returns JSX
- A second axios instance, or raw `fetch`, bypassing `lib/api.js`
- Storing server data (API responses) in Zustand
- Using TanStack Query for state that isn't server data
- A raw hex/oklch color instead of a token from `@theme`
- Keeping a `data/*.js` mock file alongside the real endpoint that replaced it
- `invalidateQueries` when the mutation response already has what `setQueryData` needs
- A hook returning `undefined` for a list — always default to `[]`

---

## 10. Final Rule

> **Calls live in services. State lives in hooks. Server state lives in TanStack Query.**
> **Tokens live in Zustand. Presentational globals live in Context. UI meaning lives in molecules.**
> **Logic lives in organisms. Pages compose — they don't build.**
