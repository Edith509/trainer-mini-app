const { Schema, model } = require("mongoose");

/**
 * Модель пользователя для бота.
 * Должна совпадать по смыслу с backend-моделью User,
 * чтобы всё было в одной коллекции.
 */
const userSchema = new Schema(
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

const User = model("User", userSchema);

module.exports = { User };
