import axios from "axios";
export const api = axios.create({
  baseURL: "https://dummyjson.com",
  headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (r) => r,
  (e) => {
    e.userMessage =
      e?.response?.data?.message ||
      e?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(e);
  },
);
export function getApiError(error) {
  return (
    error?.userMessage ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}
