export default function Banner({ text }: { text: string }) {
  return <div className="rounded-xl bg-red-600 p-4 font-semibold text-white">{text}</div>
}
