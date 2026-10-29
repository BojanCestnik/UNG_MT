interface TimerDisplayProps {
  minutes: number;
  seconds: number;
}

// Adds a leading zero: 5 -> "05".
function twoDigits(value: number): string {
  return value.toString().padStart(2, "0");
}

function TimerDisplay({ minutes, seconds }: TimerDisplayProps) {
  return (
    <p className="text-center font-mono text-7xl font-bold tabular-nums sm:text-8xl">
      {twoDigits(minutes)}:{twoDigits(seconds)}
    </p>
  );
}

export default TimerDisplay;
