import { MODE_LABELS } from "../types";
import type { Session } from "../types";

interface SessionListProps {
  sessions: Session[];
}

function SessionList({ sessions }: SessionListProps) {
  return (
    <section className="rounded-3xl bg-white/70 p-6">
      <h2 className="mb-4 text-lg font-bold">Today's sessions</h2>

      {sessions.length === 0 ? (
        <p className="text-sm opacity-70">No sessions yet. You've got this!</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="flex justify-between rounded-2xl bg-cream px-4 py-2 text-sm"
            >
              <span className="font-semibold">{MODE_LABELS[session.mode]}</span>
              <span>{session.minutes} min</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default SessionList;
