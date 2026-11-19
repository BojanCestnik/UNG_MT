import type { Birthday, BirthdayOccurrence } from "../App";

type BirthdayCardProps = {
  birthday: Birthday & { occurrence: BirthdayOccurrence };
  onEdit: (birthday: Birthday) => void;
  onDelete: (id: string) => void;
};

function BirthdayCard({
  birthday,
  onEdit,
  onDelete,
}: BirthdayCardProps) {
  const formattedDate = new Date(
    2000,
    birthday.month - 1,
    birthday.day,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const ageText =
    birthday.occurrence.age !== undefined
      ? `Turning ${birthday.occurrence.age}`
      : null;

  return (
    <article className="flex items-center gap-3 rounded-2xl border border-[#eee8df] bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff8e2] text-2xl">
        {birthday.emoji || "🎂"}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold">{birthday.name}</h3>
        <p className="mt-0.5 text-sm text-[#94897c]">
          {formattedDate}{ageText && ` · ${ageText}`}
        </p>
        <p className="mt-1 text-xs font-medium text-[#a48619]">
          {birthday.occurrence.isToday
            ? "🎉 Today!"
            : birthday.occurrence.daysRemaining === 1
              ? "Tomorrow!"
              : `${birthday.occurrence.daysRemaining} days to go`}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit(birthday)}
          aria-label={`Edit ${birthday.name}'s birthday`}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-lg transition hover:bg-[#fff8e2]"
        >
          ✏️
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete ${birthday.name}'s birthday?`)) {
              onDelete(birthday.id);
            }
          }}
          aria-label={`Delete ${birthday.name}'s birthday`}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-lg transition hover:bg-red-50"
        >
          🗑️
        </button>
      </div>
    </article>
  );
}

export default BirthdayCard;