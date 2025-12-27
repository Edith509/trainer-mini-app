// src/api/applications.ts
import api from "./http";

export interface CreateApplicationPayload {
  name: string;
  age: string;
  weight: string;
  height: string;
  medical: string;
  goal: string;
}

export async function createApplication(payload: CreateApplicationPayload) {
  // POST /api/applications
  const res = await api.post("/applications", payload);
  return res.data; // вернётся { message, application }
}
