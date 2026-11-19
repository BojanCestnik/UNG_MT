import { useEffect, useMemo, useState } from "react";
import BirthdayHero from "./components/BirthdayHero";
import BirthdayForm from "./components/BirthdayForm";
import BirthdayList from "./components/BirthdayList";

export type Birthday = {
  id: string;
  name: string;
  day: number;
  month: number;
  year?: number;
  emoji?: string;
};

export type BirthdayFormData = Omit<Birthday, "id">;

export type BirthdayOccurrence = {
  date: Date;
  daysRemaining: number;
  age?: number;
  isToday: boolean;
};

export type BirthdayWithOccurrence = Birthday & {
  occurrence: BirthdayOccurrence;
};

const STORAGE_KEY = "birthday-countdown";

const getBirthdays = (): Birthday[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item: unknown): item is Birthday => {
      if (typeof item !== "object" || item === null) return false;

      const birthday = item as Record<string, unknown>;
      const validYear =
        birthday.year === undefined ||
        (typeof birthday.year === "number" &&
          Number.isInteger(birthday.year) &&
          birthday.year > 0);

      return (
        typeof birthday.id === "string" &&
        typeof birthday.name === "string" &&
        birthday.name.trim().length > 0 &&
        typeof birthday.day === "number" &&
        Number.isInteger(birthday.day) &&
        birthday.day >= 1 &&
        birthday.day <= 31 &&
        typeof birthday.month === "number" &&
        Number.isInteger(birthday.month) &&
        birthday.month >= 1 &&
        birthday.month <= 12 &&
        validYear
      );
    });
  } catch {
    return [];
  }
};

const isLeapYear = (year: number): boolean =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

const getNextBirthday = (
  birthday: Birthday,
  today: Date,
): BirthdayOccurrence => {
  const currentYear = today.getFullYear();

  const getOccurrenceDate = (year: number): Date => {
    const day =
      birthday.month === 2 && birthday.day === 29 && !isLeapYear(year)
        ? 28
        : birthday.day;

    return new Date(year, birthday.month - 1, day);
  };

  const todayStart = new Date(
    currentYear,
    today.getMonth(),
    today.getDate(),
  );

  let nextDate = getOccurrenceDate(currentYear);

  if (nextDate < todayStart) {
    nextDate = getOccurrenceDate(currentYear + 1);
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.round(
    (nextDate.getTime() - todayStart.getTime()) / millisecondsPerDay,
  );

  const age =
    birthday.year !== undefined
      ? nextDate.getFullYear() - birthday.year
      : undefined;

  return {
    date: nextDate,
    daysRemaining,
    age,
    isToday: daysRemaining === 0,
  };
};

function App() {
  const [birthdays, setBirthdays] = useState<Birthday[]>(getBirthdays);
  const [editingBirthday, setEditingBirthday] =
    useState<Birthday | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(birthdays));
  }, [birthdays]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const sortedBirthdays = useMemo<BirthdayWithOccurrence[]>(() => {
    return birthdays
      .map((birthday) => ({
        ...birthday,
        occurrence: getNextBirthday(birthday, now),
      }))
      .sort(
        (a, b) =>
          a.occurrence.date.getTime() - b.occurrence.date.getTime(),
      );
  }, [birthdays, now]);

  const todayBirthday = sortedBirthdays.find(
    (birthday) => birthday.occurrence.isToday,
  );

  const nextBirthday = todayBirthday ?? sortedBirthdays[0] ?? null;

  const handleSubmit = (data: BirthdayFormData) => {
    if (editingBirthday) {
      setBirthdays((previous) =>
        previous.map((birthday) =>
          birthday.id === editingBirthday.id
            ? { ...data, id: birthday.id }
            : birthday,
        ),
      );
    } else {
      setBirthdays((previous) => [
        ...previous,
        { ...data, id: crypto.randomUUID() },
      ]);
    }

    setEditingBirthday(null);
    setShowForm(false);
  };

  const handleEdit = (birthday: Birthday) => {
    setEditingBirthday(birthday);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setBirthdays((previous) =>
      previous.filter((birthday) => birthday.id !== id),
    );

    if (editingBirthday?.id === id) {
      setEditingBirthday(null);
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setEditingBirthday(null);
    setShowForm(false);
  };

  return (
    <main className="min-h-screen bg-[#fdfbf7] px-4 py-10 text-[#40382f]">
      <div className="mx-auto flex w-full max-w-[460px] flex-col gap-7">
        <header className="text-center">
          <p className="mb-2 text-sm font-medium tracking-widest text-[#a49a8d] uppercase">
            A little reminder of joy
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Birthday Buddy 🎂
          </h1>
          <p className="mt-2 text-sm text-[#94897c]">
            Never miss a special day.
          </p>
        </header>

        <BirthdayHero birthday={nextBirthday} now={now} />

        <section className="space-y-3">
          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="min-h-12 w-full rounded-2xl bg-[#f6c90f] px-5 py-3 font-semibold text-[#40382f] shadow-sm transition hover:brightness-95 active:scale-[0.99]"
            >
              + Add a birthday
            </button>
          ) : (
            <BirthdayForm
              initialData={editingBirthday}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}
        </section>

        <BirthdayList
          birthdays={sortedBirthdays}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <footer className="pb-3 text-center text-xs text-[#aaa093]">
          Made with a little love and lots of cake 🎈
        </footer>
      </div>
    </main>
  );
}

export default App;