// A step is "🚰 Sentence." Optional extras: " | tip: text" and " {image.jpg}".
export function parseStep(text: string): { icon: string; sentence: string; tip: string; image: string } {
  let rest = text
  let image = ''
  let tip = ''
  const img = rest.match(/\{([^}]+\.(?:jpe?g|png|webp|gif))\}/i)
  if (img) { image = img[1]; rest = rest.replace(img[0], '') }
  const tipMatch = rest.match(/\s*\|\s*tip:\s*(.*)$/i)
  if (tipMatch) { tip = tipMatch[1].trim(); rest = rest.slice(0, tipMatch.index) }
  const lead = rest.match(/^(\p{Extended_Pictographic}[\uFE0F\u200D\p{Extended_Pictographic}]*)\s*/u)
  const icon = lead ? lead[1] : ''
  const sentence = (lead ? rest.slice(lead[0].length) : rest).trim()
  return { icon, sentence, tip, image }
}
