import type { BirthdayWithOccurrence } from "../App";

type BirthdayHeroProps = {
  birthday: BirthdayWithOccurrence | null;
  now: Date;
};

function BirthdayHero({ birthday, now }: BirthdayHeroProps) {
  if (!birthday) {
    return (
      <section className="rounded-3xl border border-[#eee8df] bg-white p-9 text-center shadow-sm">
        <div className="mb-4 text-5xl">🎈</div>
        <h2 className="text-xl font-bold">Your celebrations start here!</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#94897c]">
          Add your first birthday and we'll count down to the big day.
        </p>
      </section>
    );
  }

  if (birthday.occurrence.isToday) {
    return (
      <section className="birthday-celebration overflow-hidden rounded-3xl border border-[#f6c90f]/40 bg-[#fff7d6] p-8 text-center shadow-md">
        <div className="mb-3 text-5xl" aria-hidden="true">🎉</div>
        <p className="text-sm font-semibold tracking-widest text-[#a48619] uppercase">
          It's their special day!
        </p>
        <h2 className="mt-3 text-3xl font-bold text-[#55431a]">
          Happy birthday!
        </h2>
        <p className="mt-3 text-lg text-[#74602c]">
          {birthday.emoji || "🎂"} {birthday.name}
        </p>
        {birthday.occurrence.age !== undefined && (
          <p className="mt-2 text-sm text-[#8a7337]">
            Turning {birthday.occurrence.age} today!
          </p>
        )}
      </section>
    );
  }

  const difference = Math.max(
    0,
    birthday.occurrence.date.getTime() - now.getTime(),
  );

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const format = (value: number) => String(value).padStart(2, "0");

  return (
    <section className="rounded-3xl border border-[#f2e8d8] bg-white p-7 text-center shadow-md">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#a49a8d] uppercase">
        Next celebration
      </p>
      <div className="my-5 text-6xl">{birthday.emoji || "🎂"}</div>
      <h2 className="text-2xl font-bold">{birthday.name}</h2>
      <p className="mt-2 text-sm text-[#94897c]">
        {birthday.occurrence.date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      <div className="mt-7 rounded-2xl bg-[#fff8e2] px-3 py-6">
        <p className="mb-3 text-xs font-medium text-[#a48619] uppercase">
          Counting down
        </p>
        <div className="font-mono text-2xl font-bold tabular-nums tracking-tight text-[#40382f] sm:text-3xl">
          {days}d {format(hours)}h {format(minutes)}m {format(seconds)}s
        </div>
      </div>

      <p className="mt-4 text-sm text-[#94897c]">
        {birthday.occurrence.age !== undefined
          ? `Turning ${birthday.occurrence.age} years old!`
          : `${birthday.occurrence.daysRemaining} days to go!`}
      </p>
    </section>
  );
}

export default BirthdayHero;