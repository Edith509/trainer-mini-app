// src/routes/auth.routes.ts
import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

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

  // без жёсткой типизации, чтобы TS не ругался
  const options: any = {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  };

  // (jwt as any) — тоже чтобы игнорить странности d.ts
  return (jwt as any).sign(payload, secret, options);
}

/*
  POST /api/auth/dev-login
  ВРЕМЕННЫЙ логин по telegramId (для разработчика)

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

export default router;
