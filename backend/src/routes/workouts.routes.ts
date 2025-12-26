// src/routes/workouts.routes.ts
import { Router, Response } from "express";
import { AuthRequest, authMiddleware } from "../middlewares/authMiddleware";
import { Workout } from "../models/Workout";
import { User } from "../models/User";

const router = Router();

/*
  GET /api/workouts/my
  Пользователь видит свои тренировки
*/
router.get("/my", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    const workouts = await Workout.find(
      {
        userId: user._id,
        isActive: true,
      } as any
    ).sort({ createdAt: -1 });

    return res.json({ workouts });
  } catch (error) {
    console.error("Get my workouts error", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/*
  GET /api/workouts/admin
  Админ видит все тренировки
*/
router.get(
  "/admin",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.user!;

      if (admin.role !== "admin") {
        return res.status(403).json({ message: "Доступ запрещён" });
      }

      const workouts = await Workout.find()
        .populate("userId")
        .populate("createdBy")
        .sort({ createdAt: -1 });

      return res.json({ workouts });
    } catch (error) {
      console.error("Get workouts error", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/*
  POST /api/workouts/admin
  Админ создаёт тренировку для пользователя
*/
router.post(
  "/admin",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.user!;

      if (admin.role !== "admin") {
        return res.status(403).json({ message: "Доступ запрещён" });
      }

      const { telegramId, title, description, plan } = req.body;

      if (!telegramId || !title || !plan) {
        return res
          .status(400)
          .json({ message: "telegramId, title и plan обязательны" });
      }

      const user = await User.findOne({ telegramId });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Пользователь с таким telegramId не найден" });
      }

      const workout = await Workout.create({
        userId: user._id,
        title,
        description,
        plan,
        createdBy: admin._id,
      } as any);

      return res.json({ message: "Тренировка создана", workout });
    } catch (error) {
      console.error("Create workout error", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/*
  PATCH /api/workouts/admin/:id
  Админ редактирует тренировку
*/
router.patch(
  "/admin/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.user!;

      if (admin.role !== "admin") {
        return res.status(403).json({ message: "Доступ запрещён" });
      }

      const { id } = req.params;
      const { title, description, plan, isActive } = req.body;

      const workout = await Workout.findByIdAndUpdate(
        id,
        { title, description, plan, isActive } as any,
        { new: true }
      );

      if (!workout) {
        return res.status(404).json({ message: "Тренировка не найдена" });
      }

      return res.json({ message: "Тренировка обновлена", workout });
    } catch (error) {
      console.error("Update workout error", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/*
  DELETE /api/workouts/admin/:id
  Админ архивирует / удаляет тренировку
*/
router.delete(
  "/admin/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.user!;

      if (admin.role !== "admin") {
        return res.status(403).json({ message: "Доступ запрещён" });
      }

      const { id } = req.params;

      const workout = await Workout.findByIdAndUpdate(
        id,
        { isActive: false } as any,
        { new: true }
      );

      if (!workout) {
        return res.status(404).json({ message: "Тренировка не найдена" });
      }

      return res.json({ message: "Тренировка архивирована", workout });
    } catch (error) {
      console.error("Delete workout error", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
