import { api } from "../../lib/api";

export async function createUser(payload) {
  const res = await api.post("/users", payload);
  return res.data.data;
}

export async function listUsers({ cursor, limit = 100 } = {}) {
  const res = await api.get("/users", { params: { cursor, limit } });
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
