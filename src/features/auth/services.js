import { api } from "../../lib/api";

// Role comes from the stored account, server-side — never sent by the client.
export async function loginRequest({ username, password }) {
  const res = await api.post("/auth/login", { username, password });
  return res.data.data;
}

export async function fetchMe() {
  const res = await api.get("/users/profile");
  return res.data.data;
}
