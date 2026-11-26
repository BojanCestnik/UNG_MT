// Splits the guide's tools into the ones I own (have) and the ones I do not (missing).
export function compareTools(guideTools: string[], myTools: string[]): { have: string[]; missing: string[] } {
  return {
    have: guideTools.filter((tool) => myTools.includes(tool)),
    missing: guideTools.filter((tool) => !myTools.includes(tool)),
  }
}
