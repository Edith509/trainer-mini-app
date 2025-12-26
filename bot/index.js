require("dotenv").config();
const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const { User } = require("./userModel"); // <-- наша локальная модель

const bot = new Telegraf(process.env.BOT_TOKEN);

// Подключаемся к MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Bot connected to MongoDB");
  } catch (err) {
    console.error("Mongo connection error (bot)", err);
    process.exit(1);
  }
}

// /start — регистрируем пользователя
bot.start(async (ctx) => {
  try {
    const from = ctx.from;

    const user = await User.findOneAndUpdate(
      { telegramId: from.id },
      {
        username: from.username,
        firstName: from.first_name,
        lastName: from.last_name,
        languageCode: from.language_code,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log("User registered/updated:", user.telegramId);

    await ctx.reply(
      "Привет! 👋 Я личный кабинет тренировок.\n" +
        "Скоро здесь будет мини-приложение с твоими тренировками."
    );

    // TODO: позже добавим кнопку с открытием Mini App
  } catch (err) {
    console.error("Error in /start", err);
    await ctx.reply("Произошла ошибка, попробуй ещё раз позже 🙏");
  }
});

// Стартуем бота
(async () => {
  await connectDB();
  bot.launch();
  console.log("Bot started");
})();

// Корректная остановка
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
