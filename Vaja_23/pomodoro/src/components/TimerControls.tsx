interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

function TimerControls({ isRunning, onStart, onPause, onReset }: TimerControlsProps) {
  return (
    <div className="flex justify-center gap-3">
      {/* One button that switches between Start and Pause. */}
      <button
        type="button"
        onClick={isRunning ? onPause : onStart}
        className="w-32 rounded-2xl bg-accent px-6 py-3 font-bold shadow-sm transition-colors hover:bg-accent-dark"
      >
        {isRunning ? "Pause" : "Start"}
      </button>

      <button
        type="button"
        onClick={onReset}
        className="rounded-2xl bg-peach px-6 py-3 font-semibold transition-colors hover:bg-peach/60"
      >
        Reset
      </button>
    </div>
  );
}

export default TimerControls;
