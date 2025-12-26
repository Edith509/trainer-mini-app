import { User } from "../models/User";

interface TelegramUserPayload {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
}

export async function registerTelegramUser(payload: TelegramUserPayload) {
  const { telegramId, username, firstName, lastName, languageCode } = payload;

  // upsert — если есть пользователь, обновим, если нет — создадим
  const user = await User.findOneAndUpdate(
    { telegramId },
    {
      username,
      firstName,
      lastName,
      languageCode,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return user;
}
