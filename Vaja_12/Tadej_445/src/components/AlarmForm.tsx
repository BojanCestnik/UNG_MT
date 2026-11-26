import { useState } from "react";

type AlarmFormProps = {
  isFull: boolean;
  onAdd: (time: string, label: string) => void;
};

function AlarmForm({ isFull, onAdd }: AlarmFormProps) {
  const [time, setTime] = useState("07:00");
  const [label, setLabel] = useState("");

  function handleAdd() {
    onAdd(time, label);
    setLabel("");
  }

  return (
    <section className="rounded-3xl bg-white p-5 shadow-md">
      <div className="flex flex-wrap gap-2">
        <input
          type="time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
          aria-label="Alarm time"
          className="min-h-11 w-32 rounded-2xl border-2 border-gray-200 px-3 tabular-nums"
        />
        <input
          type="text"
          value={label}
          maxLength={20}
          placeholder="Alarm"
          onChange={(event) => setLabel(event.target.value)}
          aria-label="Alarm label"
          className="min-h-11 min-w-32 flex-1 rounded-2xl border-2 border-gray-200 px-3"
        />
      </div>
      <button
        onClick={handleAdd}
        disabled={isFull || time === ""}
        className="mt-3 min-h-11 w-full rounded-2xl bg-accent font-bold text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Add
      </button>
      {isFull && <p className="mt-2 text-center text-sm text-gray-500">Max 5 alarms</p>}
    </section>
  );
}

export default AlarmForm;
