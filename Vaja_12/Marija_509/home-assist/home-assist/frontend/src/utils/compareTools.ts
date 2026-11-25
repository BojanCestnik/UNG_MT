// Pure function, no React inside.
// TODO (you write this): split guideTools into the ones the user owns (have) and the ones they do not (missing).
// Hint: use guideTools.filter(...) and myTools.includes(...).
export function compareTools(guideTools: string[], myTools: string[]): { have: string[]; missing: string[] } {
  return { have: [], missing: [] }
}
