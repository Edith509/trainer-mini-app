import React from "react";
import type { UserTab } from "../App";

type LayoutProps = {
  title: string;
  activeTab: UserTab;
  onTabChange: (tab: UserTab) => void;
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
};

const Layout: React.FC<LayoutProps> = ({
  title,
  activeTab,
  onTabChange,
  children,
  showBack,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col">

      {/* Top Bar */}
      <header className="h-12 flex items-center justify-center border-b border-app-surface relative">
        {showBack && onBack && (
          <button
            className="absolute left-4 text-xl"
            onClick={onBack}
          >
            ←
          </button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4">{children}</main>

      {/* Bottom Navigation */}
      <nav className="h-14 border-t border-app-surface flex items-center justify-around text-xs">
        {/* Главная */}
        <button
          className={`flex-1 h-full flex flex-col items-center justify-center gap-1 ${
            activeTab === "home"
              ? "text-app-text bg-black/20"
              : "text-app-muted"
          }`}
          onClick={() => onTabChange("home")}
        >
          <span>🏠</span>
          <span>Главная</span>
        </button>

        {/* Мои тренировки */}
        <button
          className={`flex-1 h-full flex flex-col items-center justify-center gap-1 ${
            activeTab === "workouts"
              ? "text-app-text bg-black/20"
              : "text-app-muted"
          }`}
          onClick={() => onTabChange("workouts")}
        >
          <span>💪</span>
          <span>Мои тренировки</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
