// src/components/user/UserApplicationForm.tsx
import { useState } from "react";
import { createApplication } from "../../api/applications";


const UserApplicationForm: React.FC = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [medical, setMedical] = useState("");
  const [goal, setGoal] = useState("");

  const [sent, setSent] = useState(false);        // успешно отправили
  const [loading, setLoading] = useState(false);  // идёт запрос
  const [error, setError] = useState<string | null>(null); // ошибка

  const handleSubmit = async () => {
    // если уже идёт запрос — ничего не делаем
    if (loading) return;

    setError(null);
    setSent(false);

    // Простая валидация (можно расширить)
    if (!name.trim()) {
      setError("Заполни, пожалуйста, имя");
      return;
    }

    setLoading(true);
    try {
      await createApplication({
        name,
        age,
        weight,
        height,
        medical,
        goal,
      });

      // очищаем форму
      setName("");
      setAge("");
      setWeight("");
      setHeight("");
      setMedical("");
      setGoal("");

      setSent(true);
    } catch (e: any) {
      console.error("Create application error", e);
      const msg =
        e?.response?.data?.message || "Не удалось отправить заявку";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 px-4 py-4">
      {/* Успех */}
      {sent && (
        <div className="bg-green-500/10 border border-green-500/40 text-[11px] text-green-300 px-3 py-2 rounded-xl">
          Заявка отправлена ✅ Тренер свяжется с тобой, как только её
          посмотрит.
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-[11px] text-red-300 px-3 py-2 rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <p className="text-sm font-medium">
          Заполни анкету, чтобы тренер смог составить план под тебя
        </p>
        <p className="text-xs text-app-muted">
          Чем честнее и подробнее ты ответишь, тем лучше получится программа.
        </p>
      </div>

      <div className="space-y-3 text-xs">
        {/* 1) Имя */}
        <div className="space-y-1">
          <label className="text-app-muted">1) Имя</label>
          <input
            className="w-full bg-app-bg border border-app-surface rounded-xl px-3 py-2 outline-none focus:border-app-primary"
            placeholder="Как к тебе обращаться?"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 2) Возраст */}
        <div className="space-y-1">
          <label className="text-app-muted">2) Возраст</label>
          <input
            className="w-full bg-app-bg border border-app-surface rounded-xl px-3 py-2 outline-none focus:border-app-primary"
            placeholder="Например: 24"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        {/* 3) Вес */}
        <div className="space-y-1">
          <label className="text-app-muted">3) Вес (кг)</label>
          <input
            className="w-full bg-app-bg border border-app-surface rounded-xl px-3 py-2 outline-none focus:border-app-primary"
            placeholder="Например: 75"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        {/* 4) Рост */}
        <div className="space-y-1">
          <label className="text-app-muted">4) Рост (см)</label>
          <input
            className="w-full bg-app-bg border border-app-surface rounded-xl px-3 py-2 outline-none focus:border-app-primary"
            placeholder="Например: 178"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>

        {/* 5) Мед. ограничения */}
        <div className="space-y-1">
          <label className="text-app-muted">
            5) Есть ли медицинские ограничения?
          </label>
          <textarea
            rows={3}
            className="w-full bg-app-bg border border-app-surface rounded-xl px-3 py-2 outline-none resize-none focus:border-app-primary"
            placeholder="Например: колени, спина, давление и т.п."
            value={medical}
            onChange={(e) => setMedical(e.target.value)}
          />
        </div>

        {/* 6) Цель тренировок */}
        <div className="space-y-1">
          <label className="text-app-muted">
            6) Цель тренировок (похудение, набор, тонус и т.д.)
          </label>
          <textarea
            rows={3}
            className="w-full bg-app-bg border border-app-surface rounded-xl px-3 py-2 outline-none resize-none focus:border-app-primary"
            placeholder="Опиши, чего хочешь добиться"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>
      </div>

      <button
        className="w-full bg-app-primary py-3 rounded-xl text-white font-medium active:opacity-80 mt-2 disabled:opacity-60"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Отправка..." : "Отправить заявку"}
      </button>

      <p className="text-[11px] text-app-muted text-center">
        Нажимая кнопку, ты соглашаешься на обработку данных и передачу их
        тренеру.
      </p>
    </div>
  );
};

export default UserApplicationForm;
