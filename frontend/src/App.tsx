// src/App.tsx
import { useState, useEffect } from "react";
import Layout from "./layout/Layout";
import UserHome from "./components/user/UserHome";
import UserWorkouts from "./components/user/UserWorkouts";
import UserApplicationForm from "./components/user/UserApplicationForm";

import { devLogin, telegramLogin } from "./api/auth"; // ⬅️ добавили telegramLogin

export type UserTab = "home" | "workouts";
type Screen = "home" | "workouts" | "application";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [authReady, setAuthReady] = useState(false);    // когда авторизация завершена
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const tg = (window as any).Telegram?.WebApp;

        // 🔹 Если приложение запущено ВНУТРИ Telegram Mini App
        if (tg && tg.initData) {
          console.log("Running inside Telegram WebApp");

          // можно развернуть webapp на весь экран
          try {
            tg.ready();
            tg.expand();
          } catch (e) {
            console.warn("Telegram WebApp ready/expand error:", e);
          }

          const initData = tg.initData;

          const { user } = await telegramLogin(initData);
          console.log("Telegram login success, user =", user);
        } else {
          // 🔹 Если мы просто открыли фронт в браузере – используем dev-login
          console.log("Running in regular browser, using dev-login");

          // сюда ставишь СВОЙ telegramId, который есть в коллекции users
          const myTelegramId = 1001341655;

          const { user } = await devLogin(myTelegramId);
          console.log("Dev login success, user =", user);
        }

        setAuthReady(true);
      } catch (err: any) {
        console.error("Auth error", err);
        setAuthError(err?.response?.data?.message || "Ошибка авторизации");
        setAuthReady(true); // всё равно рендерим UI, просто без рабочих запросов
      }
    };

    void initAuth();
  }, []);

  const activeTab: UserTab = screen === "workouts" ? "workouts" : "home";

  const title =
    screen === "home"
      ? "Главная"
      : screen === "workouts"
      ? "Мои тренировки"
      : "Оставить заявку";

  const showBack = screen === "application";

  const handleTabChange = (tab: UserTab) => {
    setScreen(tab === "home" ? "home" : "workouts");
  };

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
          {authError}
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
