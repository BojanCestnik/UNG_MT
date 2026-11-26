import type { Alarm } from "../types";

type AlarmListProps = {
  alarms: Alarm[]; // already sorted by time
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function AlarmList({ alarms, onToggle, onDelete }: AlarmListProps) {
  if (alarms.length === 0) {
    return (
      <section className="rounded-3xl bg-white p-5 text-center text-gray-500 shadow-md">
        No alarms yet. Add one above.
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-white px-5 py-2 shadow-md">
      <ul>
        {alarms.map((alarm) => (
          <li key={alarm.id} className="flex items-center gap-2 border-b border-gray-100 py-2 last:border-b-0">
            <div className={`min-w-0 flex-1 ${alarm.enabled ? "" : "opacity-50"}`}>
              <p className="text-2xl font-bold tabular-nums text-gray-800">{alarm.time}</p>
              <p className="truncate text-sm text-gray-500">{alarm.label}</p>
            </div>
            <button
              role="switch"
              aria-checked={alarm.enabled}
              aria-label={`Turn alarm ${alarm.time} on or off`}
              onClick={() => onToggle(alarm.id)}
              className="flex min-h-11 min-w-14 items-center justify-center"
            >
              <span
                className={`flex h-7 w-12 items-center rounded-full p-0.5 ${
                  alarm.enabled ? "justify-end bg-accent" : "justify-start bg-gray-300"
                }`}
              >
                <span className="h-6 w-6 rounded-full bg-white" />
              </span>
            </button>
            <button
              onClick={() => onDelete(alarm.id)}
              aria-label={`Delete alarm ${alarm.time}`}
              className="min-h-11 rounded-2xl px-3 text-sm text-gray-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AlarmList;
