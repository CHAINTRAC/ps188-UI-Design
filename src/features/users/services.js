import { api } from "../../lib/api";

export async function createUser(payload) {
  const res = await api.post("/users", payload);
  return res.data.data;
}

export async function listUsers({ cursor, limit = 100 } = {}) {
  const res = await api.get("/users", { params: { cursor, limit } });
  return res.data.data;
}

// PATCH /api/users/:id — status (enable/disable), scope reassignment
// (checkpoint_id for a verifier, region for an admin), or role change
// (super admin only). Omit a field to leave it unchanged.
export async function updateUser(id, payload) {
  const res = await api.patch(`/users/${id}`, payload);
  return res.data.data;
}

export async function resetUserPassword(id) {
  const res = await api.post(`/users/${id}/reset-password`);
  return res.data.data;
}

export async function changeOwnPassword({ current_password, new_password }) {
  const res = await api.post("/users/change-password", { current_password, new_password });
  return res.data.data;
}
