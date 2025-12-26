type Props = {
  onOpenApplication: () => void;
};

const UserHome: React.FC<Props> = ({ onOpenApplication }) => {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-xl font-semibold">Привет 👋</h2>
        <p className="text-app-muted text-sm">
          Это твой личный кабинет тренировок
        </p>
      </div>

      <div className="bg-app-surface rounded-2xl p-4">
        <h3 className="text-lg font-medium mb-2">
          Начать тренировки
        </h3>
        <p className="text-sm text-app-muted mb-4">
          Оставь заявку, и тренер составит программу специально для тебя
        </p>

        <button
          className="w-full bg-app-primary py-3 rounded-xl text-white font-medium active:opacity-80"
          onClick={onOpenApplication}
        >
          Оставить заявку
        </button>
      </div>

    </div>
  );
};

export default UserHome;
