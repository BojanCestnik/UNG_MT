import { useEffect, useMemo, useRef, useState } from "react";
import type { Alarm } from "./types";
import { loadAlarms, saveAlarms } from "./storage";
import { startBeeping, stopBeeping, unlockAudio } from "./sound";
import Clock from "./components/Clock";
import AlarmForm from "./components/AlarmForm";
import AlarmList from "./components/AlarmList";
import RingingAlert from "./components/RingingAlert";

const MAX_ALARMS = 5;
const SNOOZE_MS = 5 * 60 * 1000;

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function App() {
  const [alarms, setAlarms] = useState<Alarm[]>(loadAlarms);
  const [now, setNow] = useState<Date>(() => new Date());
  const [ringingId, setRingingId] = useState<string | null>(null);

  // Remembers the last minute each alarm rang in, so it rings only once per minute.
  const lastRangRef = useRef<Record<string, string>>({});

  const sortedAlarms = useMemo(
    () => [...alarms].sort((a, b) => a.time.localeCompare(b.time)),
    [alarms],
  );
  const ringingAlarm = alarms.find((alarm) => alarm.id === ringingId);

  // 1. Tick the clock every second. The cleanup stops the timer.
  useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  // 2. On every tick, check whether an alarm should start ringing.
  useEffect(() => {
    if (ringingId !== null) return; // only one alarm rings at a time

    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
    const currentMinute = `${now.toDateString()} ${currentTime}`;

    for (const alarm of sortedAlarms) {
      if (!alarm.enabled) continue;

      if (alarm.snoozedUntil !== null) {
        if (now.getTime() >= alarm.snoozedUntil) {
          setRingingId(alarm.id);
          return;
        }
        continue; // still snoozing, ignore the normal time
      }

      if (alarm.time === currentTime && lastRangRef.current[alarm.id] !== currentMinute) {
        lastRangRef.current[alarm.id] = currentMinute;
        setRingingId(alarm.id);
        return;
      }
    }
  }, [now, sortedAlarms, ringingId]);

  // 3. Save the alarms to localStorage whenever they change.
  useEffect(() => {
    saveAlarms(alarms);
  }, [alarms]);

  // 4. Beep while an alarm rings. The cleanup stops the sound when it ends or the app unmounts.
  useEffect(() => {
    if (ringingId === null) return;
    startBeeping();
    return () => stopBeeping();
  }, [ringingId]);

  function handleAdd(time: string, label: string) {
    unlockAudio(); // first click: browsers now allow sound
    if (alarms.length >= MAX_ALARMS) return;
    const newAlarm: Alarm = {
      id: makeId(),
      time,
      label: label.trim() || "Alarm",
      enabled: true,
      snoozedUntil: null,
    };
    setAlarms([...alarms, newAlarm]);
  }

  function handleToggle(id: string) {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled, snoozedUntil: null } : alarm,
      ),
    );
    if (id === ringingId) setRingingId(null);
  }

  function handleDelete(id: string) {
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
    if (id === ringingId) setRingingId(null);
  }

  function handleSnooze() {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === ringingId ? { ...alarm, snoozedUntil: Date.now() + SNOOZE_MS } : alarm,
      ),
    );
    setRingingId(null);
  }

  function handleDismiss() {
    setAlarms(
      alarms.map((alarm) => (alarm.id === ringingId ? { ...alarm, snoozedUntil: null } : alarm)),
    );
    setRingingId(null);
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-violet-100 p-4">
      <div className="flex w-full max-w-md flex-col gap-4">
        <h1 className="text-center text-xl font-bold text-gray-800">Sleepy Clock 🌙</h1>
        <Clock now={now} />
        {ringingAlarm && (
          <RingingAlert alarm={ringingAlarm} onSnooze={handleSnooze} onDismiss={handleDismiss} />
        )}
        <AlarmForm isFull={alarms.length >= MAX_ALARMS} onAdd={handleAdd} />
        <AlarmList alarms={sortedAlarms} onToggle={handleToggle} onDelete={handleDelete} />
        <p className="text-center text-sm text-gray-600">Keep this tab open for alarms to ring.</p>
      </div>
    </main>
  );
}

export default App;
