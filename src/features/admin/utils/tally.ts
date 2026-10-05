export type TallyItem = { label: string; value: number };

/** Counts occurrences of each label, largest first. */
export function tally(labels: string[]): TallyItem[] {
  const counts = new Map<string, number>();
  for (const label of labels) counts.set(label, (counts.get(label) ?? 0) + 1);
  return [...counts].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}
