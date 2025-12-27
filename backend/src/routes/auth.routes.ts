// src/routes/auth.routes.ts
import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { verifyTelegramInitData } from "../utils/verifyTelegram";
import { registerTelegramUser } from "../services/telegramUserService";

const router = Router();

/* ──────────────────────────────
   Тип payload для JWT
   ────────────────────────────── */
interface JwtPayload {
  userId: string;
}

/* ──────────────────────────────
   Функция генерации токена
   ────────────────────────────── */
function signToken(userId: string): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  const payload: JwtPayload = { userId };

  const options: any = {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  };

  return (jwt as any).sign(payload, secret, options);
}

/* ──────────────────────────────
   ВРЕМЕННЫЙ dev-login по telegramId
   ────────────────────────────── */
/*
  POST /api/auth/dev-login

  Тело запроса:
  {
    "telegramId": 1001341655
  }
*/
router.post(
  "/dev-login",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { telegramId } = req.body;

      if (!telegramId) {
        return res
          .status(400)
          .json({ message: "telegramId обязателен" });
      }

      const user = await User.findOne({ telegramId });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Пользователь не найден" });
      }

      const token = signToken(user._id.toString());

      return res.json({
        token,
        user: {
          id: user._id,
          telegramId: user.telegramId,
          username: user.username,
          firstName: user.firstName,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("dev-login error", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* ──────────────────────────────
   Основной логин через Telegram Mini App
   ────────────────────────────── */
/*
  POST /api/auth/telegram

  Тело запроса:
  {
    "initData": "<строка из window.Telegram.WebApp.initData>"
  }
*/
router.post(
  "/telegram",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { initData } = req.body;

      if (!initData) {
        return res
          .status(400)
          .json({ message: "initData обязателен" });
      }

      const botToken = process.env.BOT_TOKEN;
      if (!botToken) {
        console.error("BOT_TOKEN is not set");
        return res.status(500).json({ message: "BOT_TOKEN not set" });
      }

      // 1) Проверяем подпись
      const isValid = verifyTelegramInitData(initData, botToken);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid initData" });
      }

      // 2) Достаём данные user из initData
      const params = new URLSearchParams(initData);
      const userStr = params.get("user");

      if (!userStr) {
        return res.status(400).json({ message: "user not found in initData" });
      }

      const tgUser = JSON.parse(userStr) as {
        id: number;
        username?: string;
        first_name?: string;
        last_name?: string;
        language_code?: string;
      };

      // 3) upsert пользователя в БД
      const user = await registerTelegramUser({
        telegramId: tgUser.id,
        username: tgUser.username,
        firstName: tgUser.first_name,
        lastName: tgUser.last_name,
        languageCode: tgUser.language_code,
      });

      const token = signToken(user._id.toString());

      return res.json({
        token,
        user: {
          id: user._id,
          telegramId: user.telegramId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("telegram auth error", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
