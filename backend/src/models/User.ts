import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  telegramId: number;          // id из Telegram (ctx.from.id)
  username?: string;           // @username
  firstName?: string;
  lastName?: string;
  languageCode?: string;
  role: "user" | "admin";      // тренера потом сделаем admin
}

const UserSchema = new Schema<IUser>(
  {
    telegramId: { type: Number, required: true, unique: true },
    username: String,
    firstName: String,
    lastName: String,
    languageCode: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
