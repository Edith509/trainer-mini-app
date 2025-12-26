// import { Schema, model, Document } from "mongoose";

// export interface IApplication extends Document {
//   userId: string;                // Telegram id (пока можно демо-значение)
//   username?: string;             // @username, добавим позже из Telegram
//   name?: string;                 // Имя из формы
//   age?: string;                  // Возраст
//   weight?: string;               // Вес
//   height?: string;               // Рост
//   medical?: string;              // Медицинские противопоказания
//   goal?: string;                 // Цель тренировок
//   status: "new" | "in_progress" | "done" | "rejected";
// }

// const ApplicationSchema = new Schema<IApplication>(
//   {
//     userId: { type: String, required: true },
//     username: String,

//     name: String,
//     age: String,
//     weight: String,
//     height: String,
//     medical: String,
//     goal: String,

//     status: {
//       type: String,
//       enum: ["new", "in_progress", "done", "rejected"],
//       default: "new",
//     },
//   },
//   { timestamps: true }
// );

// export const Application = model<IApplication>("Application", ApplicationSchema);


import { Schema, model, Document } from "mongoose";

export interface IApplication extends Document {
  userId: string;  // пока просто строка, потом тут будет Telegram ID

  name?: string;
  age?: string;
  weight?: string;
  height?: string;
  medical?: string;
  goal?: string;

  status: "new" | "processed" | "rejected";
  trainerComment?: string;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: { type: String, required: true },

    name: String,
    age: String,
    weight: String,
    height: String,
    medical: String,
    goal: String,

    status: {
      type: String,
      enum: ["new", "processed", "rejected"],
      default: "new",
    },

    trainerComment: String,
  },
  { timestamps: true }
);

export const Application = model<IApplication>("Application", ApplicationSchema);
