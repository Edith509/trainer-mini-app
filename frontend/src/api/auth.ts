// src/api/auth.ts
import api from "./http";

export async function devLogin(telegramId: number) {
  const res = await api.post("/auth/dev-login", { telegramId });
  const { token, user } = res.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
}
