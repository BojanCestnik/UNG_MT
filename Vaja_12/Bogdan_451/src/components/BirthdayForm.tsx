import { useEffect, useState, type FormEvent } from "react";
import type { Birthday, BirthdayFormData } from "../App";

type BirthdayFormProps = {
  initialData: Birthday | null;
  onSubmit: (data: BirthdayFormData) => void;
  onCancel: () => void;
};

function BirthdayForm({
  initialData,
  onSubmit,
  onCancel,
}: BirthdayFormProps) {
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [emoji, setEmoji] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(initialData?.name ?? "");
    setDay(initialData ? String(initialData.day) : "");
    setMonth(initialData ? String(initialData.month) : "");
    setYear(
      initialData?.year !== undefined ? String(initialData.year) : "",
    );
    setEmoji(initialData?.emoji ?? "");
    setError("");
  }, [initialData]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const birthdayDay = Number(day);
    const birthdayMonth = Number(month);
    const birthdayYear = year ? Number(year) : undefined;

    if (!name.trim()) {
      setError("Please enter a name.");
      return;
    }

    if (
      !Number.isInteger(birthdayDay) ||
      !Number.isInteger(birthdayMonth) ||
      birthdayMonth < 1 ||
      birthdayMonth > 12 ||
      birthdayDay < 1 ||
      birthdayDay > 31
    ) {
      setError("Please enter a valid day and month.");
      return;
    }

    const daysInMonth = new Date(2000, birthdayMonth, 0).getDate();
    if (birthdayDay > daysInMonth) {
      setError("That date doesn't exist in the selected month.");
      return;
    }

    if (
      birthdayYear !== undefined &&
      (!Number.isInteger(birthdayYear) ||
        birthdayYear < 1 ||
        birthdayYear > new Date().getFullYear())
    ) {
      setError("Please enter a valid birth year.");
      return;
    }

    onSubmit({
      name: name.trim(),
      day: birthdayDay,
      month: birthdayMonth,
      year: birthdayYear,
      emoji: emoji.trim() || "🎂",
    });
  };

  const inputClass =
    "min-h-12 w-full rounded-xl border border-[#eee6db] bg-[#fdfbf7] px-4 text-sm outline-none transition focus:border-[#e6bb13] focus:ring-2 focus:ring-[#f6c90f]/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#eee8df] bg-white p-5 shadow-md"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          {initialData ? "Edit birthday" : "Add a birthday"}
        </h2>
        <span className="text-2xl" aria-hidden="true">🎁</span>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="birthday-name" className="mb-1.5 block text-sm font-medium">
            Name *
          </label>
          <input
            id="birthday-name"
            className={inputClass}
            placeholder="e.g. Alex"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="birthday-day" className="mb-1.5 block text-sm font-medium">
              Day *
            </label>
            <input
              id="birthday-day"
              className={inputClass}
              type="number"
              min="1"
              max="31"
              placeholder="DD"
              value={day}
              onChange={(event) => setDay(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="birthday-month" className="mb-1.5 block text-sm font-medium">
              Month *
            </label>
            <select
              id="birthday-month"
              className={inputClass}
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              required
            >
              <option value="">Select month</option>
              {[
                "January", "February", "March", "April",
                "May", "June", "July", "August",
                "September", "October", "November", "December",
              ].map((monthName, index) => (
                <option key={monthName} value={index + 1}>
                  {monthName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="birthday-year" className="mb-1.5 block text-sm font-medium">
            Birth year <span className="font-normal text-[#aaa093]">(optional)</span>
          </label>
          <input
            id="birthday-year"
            className={inputClass}
            type="number"
            min="1"
            max={new Date().getFullYear()}
            placeholder="e.g. 1995"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="birthday-emoji" className="mb-1.5 block text-sm font-medium">
            Favorite emoji <span className="font-normal text-[#aaa093]">(optional)</span>
          </label>
          <input
            id="birthday-emoji"
            className={inputClass}
            placeholder="🎂"
            value={emoji}
            onChange={(event) => setEmoji(event.target.value)}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="min-h-12 flex-1 rounded-xl bg-[#f6c90f] px-4 py-3 text-sm font-semibold transition hover:brightness-95"
        >
          {initialData ? "Save changes" : "Add birthday"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="min-h-12 rounded-xl border border-[#eee6db] px-5 text-sm font-medium transition hover:bg-[#fdfbf7]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default BirthdayForm;