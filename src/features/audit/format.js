import { timeAgo } from "../../lib/format";

const VERDICT_TONE = { GENUINE: "good", SUSPICIOUS: "warn", FAKE: "bad" };
const DECISION_TONE = { accept: "good", escalate: "warn", reject: "bad" };

const ACTION_META = {
  "auth.login": {
    type: "login",
    tone: () => "brand",
    verb: () => "logged in",
  },
  "user.created": {
    type: "user",
    tone: () => "brand",
    verb: (e) => `created ${e.new_data?.role ?? "user"} ${e.new_data?.username ?? ""}`.trim(),
  },
  "user.password_changed": {
    type: "user",
    tone: () => "brand",
    verb: () => "changed their password",
  },
  "user.updated": {
    type: "user",
    tone: () => "brand",
    verb: (e) => `updated ${e.new_data?.target_username ?? "an account"}`,
  },
  "user.role_changed": {
    type: "user",
    tone: () => "warn",
    verb: (e) =>
      `changed ${e.new_data?.target_username ?? "an account"} to ${e.new_data?.role ?? "a new role"}`,
  },
  "user.disabled": {
    type: "user",
    tone: () => "bad",
    verb: (e) => `disabled ${e.new_data?.target_username ?? "an account"}`,
  },
  "user.password_reset": {
    type: "user",
    tone: () => "warn",
    verb: (e) => `reset password for ${e.new_data?.target_username ?? "a user"}`,
  },
  "checkpoint.created": {
    type: "user",
    tone: () => "brand",
    verb: (e) => `registered checkpoint ${e.reference_id}`,
  },
  "checkpoint.updated": {
    type: "user",
    tone: () => "brand",
    verb: (e) => `updated checkpoint ${e.reference_id}`,
  },
  "blacklist.added": {
    type: "user",
    tone: () => "warn",
    verb: () => "added a blacklist entry",
  },
  "blacklist.deactivated": {
    type: "user",
    tone: () => "brand",
    verb: () => "deactivated a blacklist entry",
  },
  "screening.submitted": {
    type: "user",
    tone: (e) => VERDICT_TONE[e.new_data?.verdict] ?? "brand",
    verb: () => "submitted screening",
  },
  "screening.decided": {
    type: "decision",
    tone: (e) => DECISION_TONE[e.new_data?.decision] ?? "brand",
    verb: (e) => e.new_data?.decision ?? "decided",
  },
};

// Maps a raw AuditLogView (id/user_id/action/region/reference_type/
// reference_id/old_data/new_data/created_at) onto the {actor, action, ref,
// detail, tone, type, time} shape the audit trail UI renders. usersById is a
// { [id]: full_name } map so the trail shows a name instead of a raw user_id.
export function describeAuditEntry(entry, usersById = {}) {
  const meta = ACTION_META[entry.action] ?? { type: "user", tone: () => "brand", verb: () => entry.action };
  return {
    ref: entry.new_data?.reference_no ?? null,
    actor: usersById[entry.user_id] ?? "Unknown user",
    action: meta.verb(entry),
    detail: `${entry.action}${entry.region ? " · " + entry.region : ""}`,
    tone: meta.tone(entry),
    type: meta.type,
    time: timeAgo(entry.created_at),
  };
}
