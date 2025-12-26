import { useState } from "react";

const UserApplicationForm: React.FC = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [medical, setMedical] = useState("");
  const [goal, setGoal] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    // позже сюда добавим запрос на backend
    console.log({
      name,
      age,
      weight,
      height,
      medical,
      goal,
    });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center gap-3">
        <div className="text-4xl">✅</div>
        <div className="space-y-1">
          <p className="text-base font-medium">Заявка отправлена</p>
          <p className="text-xs text-app-muted">
            Тренер получит ответы и свяжется с тобой в Telegram.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Оставить заявку</h2>
        <p className="text-sm text-app-muted">
          Тренер получит заявку и свяжется с тобой в Telegram.
        </p>
      </div>

      <div className="space-y-4 text-sm">
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
            placeholder="Например: 25"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        {/* 3) Вес */}
        <div className="space-y-1">
          <label className="text-app-muted">3) Вес</label>
          <input
            className="w-full bg-app-bg border border-app-surface rounded-xl px-3 py-2 outline-none focus:border-app-primary"
            placeholder="Например: 78 кг"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        {/* 4) Рост (примерный) */}
        <div className="space-y-1">
          <label className="text-app-muted">4) Рост (примерный)</label>
          <input
            className="w-full bg-app-bg border border-app-surface rounded-xl px-3 py-2 outline-none focus:border-app-primary"
            placeholder="Например: 178 см"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>

        {/* 5) Мед. противопоказания */}
        <div className="space-y-1">
          <label className="text-app-muted">
            5) Есть ли медицинские противопоказания (если есть, то какие)
          </label>
          <textarea
            rows={3}
            className="w-full bg-app-bg border border-app-surface rounded-xl px-3 py-2 outline-none resize-none focus:border-app-primary"
            placeholder="Например: проблемы с коленями, спина, сердечно-сосудистые и т.п."
            value={medical}
            onChange={(e) => setMedical(e.target.value)}
          />
        </div>

        {/* 6) Цель тренировок */}
        <div className="space-y-1">
          <label className="text-app-muted">
            6) Цель тренировок (похудение, набор массы, улучшить качество тела)
          </label>
          <textarea
            rows={3}
            className="w-full bg-app-bg border border-app-surface rounded-xl px-3 py-2 outline-none resize-none focus:border-app-primary"
            placeholder="Кратко опиши, чего хочешь добиться"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>
      </div>

      <button
        className="w-full bg-app-primary py-3 rounded-xl text-white font-medium active:opacity-80 mt-2"
        onClick={handleSubmit}
      >
        Отправить заявку
      </button>

      <p className="text-[11px] text-app-muted text-center">
        Нажимая кнопку, ты соглашаешься на обработку данных и передачу их тренеру.
      </p>
    </div>
  );
};

export default UserApplicationForm;
