// The three timer modes.
export type Mode = "focus" | "shortBreak" | "longBreak";

// How many minutes each mode lasts, e.g. { focus: 25, shortBreak: 5, longBreak: 15 }.
export type Durations = Record<Mode, number>;

// One finished timer run, shown in "Today's sessions".
export interface Session {
  id: string;
  mode: Mode;
  minutes: number;
}

// Human-friendly names for each mode.
export const MODE_LABELS: Record<Mode, string> = {
  focus: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

// The order the modes appear in on screen.
export const MODES: Mode[] = ["focus", "shortBreak", "longBreak"];
