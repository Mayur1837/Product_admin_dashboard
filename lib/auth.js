import { api } from "./api";
export async function login(username, password) {
  const { data } = await api.post("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });
  return data;
}
