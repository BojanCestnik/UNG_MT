import type { Birthday, BirthdayWithOccurrence } from "../App";
import BirthdayCard from "./BirthdayCard";

type BirthdayListProps = {
  birthdays: BirthdayWithOccurrence[];
  onEdit: (birthday: Birthday) => void;
  onDelete: (id: string) => void;
};

function BirthdayList({
  birthdays,
  onEdit,
  onDelete,
}: BirthdayListProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Upcoming birthdays</h2>
        <span className="rounded-full bg-[#fff1c2] px-3 py-1 text-xs font-semibold text-[#92731a]">
          {birthdays.length} {birthdays.length === 1 ? "person" : "people"}
        </span>
      </div>

      {birthdays.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e8dfd2] p-6 text-center">
          <p className="text-sm text-[#94897c]">
            Your birthday list is empty. Add someone special to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {birthdays.map((birthday) => (
            <BirthdayCard
              key={birthday.id}
              birthday={birthday}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default BirthdayList;