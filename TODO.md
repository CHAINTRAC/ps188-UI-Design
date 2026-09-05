# Wiring status

Tracks which screens in `src/pages/` talk to the real `ps188-backend` API vs. which
still show mock/static data. Update this file in the same change that wires or
unwires a page — don't let it drift.

## ✅ Wired

| Page | Backend endpoints used |
|---|---|
| `SignIn.jsx` | `POST /auth/login` |
| `Profile.jsx` | `GET /users/profile`, `POST /users/change-password` |
| `verifier/VerifierDashboard.jsx` | `POST /screenings`, `POST /screenings/:id/decision` |
| `verifier/VerifierHistory.jsx` | `GET /screenings`, `GET /screenings/:id`, `GET /screenings/:id/image` |
| `admin/AdminDashboard.jsx` | `GET /users`, `GET /checkpoints`, `GET /screenings` (stats derived client-side) |
| `admin/Verifiers.jsx` | `GET/POST /users`, `POST /users/:id/reset-password`, `GET /checkpoints`, `GET /screenings` |
| `admin/Reports.jsx` | `GET /users`, `GET /screenings` (breakdowns derived client-side) |
| `admin/Blacklist.jsx` | `GET/POST /blacklist`, `POST /blacklist/:id/deactivate` |
| `superadmin/SuperAdminDashboard.jsx` | `GET /users`, `GET /checkpoints`, `GET /screenings` (org stats derived client-side) — audit feed still mock, see below |
| `superadmin/Admins.jsx` | `GET/POST /users`, `POST /users/:id/reset-password`, `GET /checkpoints` |
| `superadmin/Checkpoints.jsx` | `GET/POST /checkpoints`, `GET /users` (admin picker) |
| `superadmin/Blacklist.jsx` | same as `admin/Blacklist.jsx` (shared component, both routes) |
| `components/shared/ScreeningDetailModal.jsx` | `GET /screenings/:id`, `GET /screenings/:id/image` |

## ❌ Not wired

| Page | Why |
|---|---|
| `admin/AuditLog.jsx` | Shows `data/adminData.js:adminAuditLog` (mock). **No backend endpoint exists** — audit entries are written to `audit_logs` on every action but there's no `GET` to list them. |
| `superadmin/AuditTrail.jsx` | Same as above — mock `data/superAdminData.js:orgAuditLog`, no backend endpoint. |
| `SuperAdminDashboard.jsx` (Audit Trail card only) | Same as above — mock `data/mockData.js:auditTrail`, no backend endpoint. Rest of the page is wired. |
| `superadmin/Settings.jsx` | Fully static/local state (security toggles, role-permissions matrix) — no backend endpoint backs any of it. |

**Unblocking the audit pages**: needs a `GET /audit-logs` (or similar) endpoint added to `ps188-backend` first. Once that exists, replace the three mock imports above with a shared `features/audit/` hook.

## Backend endpoints with no frontend caller

- `GET /blacklist/check` — not needed for management (list/create/deactivate cover the Blacklist page); the actual blacklist-hit detection already happens automatically server-side during `POST /screenings` and surfaces via `ScreeningView.flags`/`blacklist_matches` in the verifier's evidence panel.

## Not applicable

- `Landing.jsx` — public marketing page, intentionally static.
