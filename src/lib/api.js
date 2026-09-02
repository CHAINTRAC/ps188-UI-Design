import axios from "axios";
import { useAuthStore } from "../store/authStore";

const ERR_TOKEN_EXPIRED = 20003; // ps188-backend/internal/apperr

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise = null; // single-flight: concurrent 401s share one refresh call

async function refreshAccessToken() {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) throw new Error("No refresh token available");
  // plain axios, not `api` — must not itself hit the interceptor below
  const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refresh_token: refreshToken });
  const accessToken = res.data.data.access_token;
  useAuthStore.getState().setAccessToken(accessToken);
  return accessToken;
}

function forceLogout() {
  useAuthStore.getState().clearTokens();
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    if (!response || !config) return Promise.reject(error);

    const isAuthEndpoint = config.url?.includes("/auth/"); // a failed login must surface to the form, not force a logout
    if (isAuthEndpoint) return Promise.reject(error);

    const code = response.data?.error?.code;

    if (response.status === 401 && code === ERR_TOKEN_EXPIRED && !config._retriedAfterRefresh) {
      config._retriedAfterRefresh = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const newToken = await refreshPromise;
        config.headers.Authorization = `Bearer ${newToken}`;
        return api(config);
      } catch {
        forceLogout();
        return Promise.reject(error);
      }
    }

    if (response.status === 401) {
      forceLogout();
    }

    return Promise.reject(error);
  }
);
