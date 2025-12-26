// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRouter from "./routes/auth.routes";
import applicationsRouter from "./routes/applications.routes";
import workoutsRouter from "./routes/workouts.routes";

dotenv.config();

const app = express();

// CORS — разрешаем запросы с фронта
app.use(
  cors({
    origin: "*",        // для dev можно так, потом сузим
  })
);

app.use(express.json());

// ВСЕ API под /api/...
app.use("/api/auth", authRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/workouts", workoutsRouter);

// тестовый роут
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// подключаемся к БД
connectDB();

export default app;
