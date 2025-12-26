// src/api/http.ts
import axios from "axios";

const api = axios.create({
  // Убедись, что во фронтовом .env есть VITE_API_URL
  // Например: VITE_API_URL="http://localhost:5000/api"
  baseURL: import.meta.env.VITE_API_URL,
});

// Перехватчик: перед каждым запросом подкладываем токен, если он есть
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");

  if (token) {
    // если headers ещё нет — создаём пустой объект
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
