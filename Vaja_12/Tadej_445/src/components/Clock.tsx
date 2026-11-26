type ClockProps = {
  now: Date;
};

function Clock({ now }: ClockProps) {
  const time = now.toTimeString().slice(0, 8); // "HH:MM:SS"
  const weekday = now.toLocaleDateString("en-GB", { weekday: "long" });
  const dayAndMonth = now.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

  return (
    <section className="rounded-3xl bg-white p-6 text-center shadow-md">
      <p className="text-6xl font-bold tabular-nums text-gray-800">{time}</p>
      <p className="mt-2 text-gray-500">
        {weekday}, {dayAndMonth}
      </p>
    </section>
  );
}

export default Clock;
