// A step may start with an emoji that illustrates it, e.g. "🚰 Turn off the water."
export default function StepView({ text }: { text: string }) {
  const match = text.match(/^(\p{Extended_Pictographic}\S*)\s+(.*)$/u)
  const icon = match ? match[1] : null
  const sentence = match ? match[2] : text
  return (
    <div className="flex flex-col items-center gap-6">
      {icon && <div className="flex h-32 w-32 items-center justify-center rounded-full bg-teal-100 text-6xl">{icon}</div>}
      <p className="text-center text-lg leading-relaxed">{sentence}</p>
    </div>
  )
}
