// src/routes/applications.routes.ts
import { Router, Response } from "express";
import { Application } from "../models/Application";
import { AuthRequest, authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

/*
  POST /api/applications
  Пользователь оставляет заявку (через JWT)
*/
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!; // после authMiddleware пользователь точно есть

    // Проверяем, есть ли уже новая заявка от этого пользователя
    const existing = await Application.findOne(
      {
        userId: user._id,
        status: "new",
      } as any // небольшой хак против придирок TS к типам Mongoose
    );

    if (existing) {
      return res.status(400).json({
        message: "У вас уже есть активная заявка",
      });
    }

    // достаём поля из тела запроса
    const { name, age, weight, height, medical, goal } = req.body;

    const application = await Application.create({
      userId: user._id,
      name,
      age,
      weight,
      height,
      medical,
      goal,
      status: "new",
    } as any);

    return res.status(201).json({
      message: "Заявка создана",
      application,
    });
  } catch (error) {
    console.error("Create application error", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/*
  GET /api/applications/admin
  Админ видит заявки (по умолчанию только новые)
*/
router.get(
  "/admin",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user!;

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Доступ запрещён" });
      }

      const status = (req.query.status as string) || "new";

      const applications = await Application.find(
        { status } as any
      )
        .populate("userId")
        .sort({ createdAt: -1 });

      return res.json({ applications });
    } catch (error) {
      console.error("Get applications error", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/*
  PATCH /api/applications/admin/:id
  Админ меняет статус заявки
*/
router.patch(
  "/admin/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user!;

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Доступ запрещён" });
      }

      const { id } = req.params;
      const { status, trainerComment } = req.body;

      if (!["new", "processed", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Некорректный статус" });
      }

      const application = await Application.findByIdAndUpdate(
        id,
        { status, trainerComment } as any,
        { new: true }
      );

      if (!application) {
        return res.status(404).json({ message: "Заявка не найдена" });
      }

      return res.json({ message: "Заявка обновлена", application });
    } catch (error) {
      console.error("Update application error", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
