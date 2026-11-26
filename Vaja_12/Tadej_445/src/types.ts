export type Alarm = {
  id: string;
  time: string; // "HH:MM"
  label: string;
  enabled: boolean;
  snoozedUntil: number | null; // timestamp in ms
};
