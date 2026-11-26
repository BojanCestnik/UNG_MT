export type Category = 'Študij' | 'Delo' | 'Osebno' | 'Zdravje' | 'Drugo';
export type GoalPeriod = 'daily' | 'weekly' | 'monthly';
export type Screen = 'home' | 'tasks' | 'calendar' | 'goals' | 'statistics' | 'settings';

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: Category;
  important: boolean;
  completed: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: Category;
  reminderMinutesBefore: number | null;
}

export interface Goal {
  id: string;
  title: string;
  period: GoalPeriod;
  deadline: string;
  target: number;
  progress: number;
  completed: boolean;
}

export interface AppSettings {
  remindersEnabled: boolean;
  defaultReminderMinutes: number;
}

export interface PlannerData {
  tasks: Task[];
  events: CalendarEvent[];
  goals: Goal[];
  settings: AppSettings;
}
