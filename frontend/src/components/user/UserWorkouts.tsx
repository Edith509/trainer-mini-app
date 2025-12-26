const UserWorkouts = () => {
  const hasWorkouts = false;

  if (!hasWorkouts) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center gap-3">
        <div className="text-4xl">📄</div>
        <div className="space-y-1">
          <p className="text-base font-medium">Пока нет тренировок</p>
          <p className="text-xs text-app-muted">
            Оставь заявку, и тренер добавит сюда твою первую программу
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Мои тренировки</h2>

      <div className="bg-app-surface rounded-2xl p-4">
        <h3 className="text-base font-medium">Название тренировки</h3>
        <p className="text-xs text-app-muted mt-1">
          Краткое описание, дата, статус и т.д.
        </p>
      </div>
    </div>
  );
};

export default UserWorkouts;
