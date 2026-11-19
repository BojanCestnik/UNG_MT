import { useEffect, useState } from "react";
import ModeSelector from "./components/ModeSelector";
import SessionList from "./components/SessionList";
import SettingsPanel from "./components/SettingsPanel";
import TimerControls from "./components/TimerControls";
import TimerDisplay from "./components/TimerDisplay";
import type { Durations, Mode, Session } from "./types";

const DEFAULT_DURATIONS: Durations = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
};

function App() {
  const [mode, setMode] = useState<Mode>("focus");
  const [durations, setDurations] = useState<Durations>(DEFAULT_DURATIONS);
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_DURATIONS.focus * 60); // in seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Countdown: while running, take one second off every second.
  // timeLeft is in the dependency array, so after each tick the effect
  // cleans up the old interval and starts a new one with the fresh value.
  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      if (timeLeft > 1) {
        setTimeLeft(timeLeft - 1);
        return;
      }

      // Reached 0:00 → stop the timer and log the finished session.
      setTimeLeft(0);
      setIsRunning(false);
      setSessions((previous) => [
        ...previous,
        { id: crypto.randomUUID(), mode, minutes: durations[mode] },
      ]);
    }, 1000);

    // Cleanup: stop the interval when paused, on the next tick, or on unmount.
    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, mode, durations]);

  function handleSelectMode(newMode: Mode) {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(durations[newMode] * 60);
  }

  function handleStart() {
    // If the timer already finished, start a fresh run.
    if (timeLeft === 0) {
      setTimeLeft(durations[mode] * 60);
    }
    setIsRunning(true);
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleReset() {
    setIsRunning(false);
    setTimeLeft(durations[mode] * 60);
  }

  function handleChangeDuration(changedMode: Mode, minutes: number) {
    setDurations((previous) => ({ ...previous, [changedMode]: minutes }));

    // If we changed the current mode while paused, show the new time right away.
    if (changedMode === mode && !isRunning) {
      setTimeLeft(minutes * 60);
    }
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <h1 className="text-center text-3xl font-bold">🍅 Pomodoro</h1>

        <section className="flex flex-col gap-8 rounded-3xl bg-white/70 p-6 shadow-md">
          <ModeSelector currentMode={mode} onSelectMode={handleSelectMode} />
          <TimerDisplay minutes={minutes} seconds={seconds} />
          <TimerControls
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />
        </section>

        <SettingsPanel durations={durations} onChangeDuration={handleChangeDuration} />
        <SessionList sessions={sessions} />
      </div>
    </main>
  );
}

export default App;
