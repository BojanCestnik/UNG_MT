import type { Alarm } from "../types";

type RingingAlertProps = {
  alarm: Alarm;
  onSnooze: () => void;
  onDismiss: () => void;
};

function RingingAlert({ alarm, onSnooze, onDismiss }: RingingAlertProps) {
  return (
    <section
      role="alert"
      className="animate-gentle-pulse rounded-3xl bg-accent p-6 text-center text-gray-900 shadow-md motion-reduce:animate-none"
    >
      <p className="font-bold">{alarm.label}</p>
      <p className="text-4xl font-bold tabular-nums">{alarm.time}</p>
      <div className="mt-4 flex gap-2">
        <button onClick={onSnooze} className="min-h-11 flex-1 rounded-2xl bg-white font-bold">
          Snooze 5 min
        </button>
        <button onClick={onDismiss} className="min-h-11 flex-1 rounded-2xl bg-gray-900 font-bold text-white">
          Dismiss
        </button>
      </div>
    </section>
  );
}

export default RingingAlert;
