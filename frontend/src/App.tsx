// src/App.tsx
import { useState, useEffect } from "react";
import Layout from "./layout/Layout";
import UserHome from "./components/user/UserHome";
import UserWorkouts from "./components/user/UserWorkouts";
import UserApplicationForm from "./components/user/UserApplicationForm";

import { devLogin } from "./api/auth"; // 🔹 добавили

export type UserTab = "home" | "workouts";
type Screen = "home" | "workouts" | "application";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [authReady, setAuthReady] = useState(false); // 🔹 чтобы знать, когда токен получен
  const [authError, setAuthError] = useState<string | null>(null);

  // 🔹 Дев-логин по telegramId при старте приложения
  useEffect(() => {
    const runDevLogin = async () => {
      try {
        // 👇 сюда ставишь СВОЙ telegramId, который есть в коллекции users
        const myTelegramId = 1001341655;

        const { user } = await devLogin(myTelegramId);
        console.log("Dev login success, user =", user);
        setAuthReady(true);
      } catch (err: any) {
        console.error("Dev login error", err);
        setAuthError("Ошибка авторизации (dev-login)");
        setAuthReady(true); // всё равно даём рендерить UI, просто без токена
      }
    };

    runDevLogin();
  }, []);

  // активный таб для нижней навигации
  const activeTab: UserTab = screen === "workouts" ? "workouts" : "home";

  // заголовок
  const title =
    screen === "home"
      ? "Главная"
      : screen === "workouts"
      ? "Мои тренировки"
      : "Оставить заявку";

  // показывать ли стрелку "назад"
  const showBack = screen === "application";

  const handleTabChange = (tab: UserTab) => {
    setScreen(tab === "home" ? "home" : "workouts");
  };

  // Пока ждём dev-login — можно показать простой лоадер
  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main text-app-muted">
        Загрузка...
      </div>
    );
  }

  return (
    <Layout
      title={title}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      showBack={showBack}
      onBack={() => setScreen("home")}
    >
      {authError && (
        <div className="px-4 pt-2 text-xs text-red-400">
          {authError} — проверь бекенд или telegramId
        </div>
      )}

      {screen === "home" && (
        <UserHome onOpenApplication={() => setScreen("application")} />
      )}

      {screen === "workouts" && <UserWorkouts />}

      {screen === "application" && <UserApplicationForm />}
    </Layout>
  );
}

export default App;
