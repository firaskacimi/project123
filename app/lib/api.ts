import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Set the Authorization header for all future requests.
 * Call this after storing token in localStorage so protected endpoints work.
 */
export function setAuthToken(token?: string | null) {
  if (typeof window === "undefined") return;
  const t = token ?? localStorage.getItem("token");
  if (t) {
    api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
  }
}

export function clearAuthToken() {
  if (api.defaults.headers && api.defaults.headers.common) {
    delete api.defaults.headers.common["Authorization"];
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}
