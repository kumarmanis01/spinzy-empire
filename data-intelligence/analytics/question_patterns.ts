import type { UsageEvent } from './usage_tracker';

function normalizeQuestion(q: string): string {
  return q
    .toLowerCase()
    .replace(/["'`.,?!;:()\[\]{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Aggregate simple question patterns by first N words (basic grouping).
 * Pure utility — does not mutate external state.
 */
export function aggregateQuestionPatterns(events: UsageEvent[], firstWords = 5) {
  const counts: Record<string, number> = {};

  for (const ev of events) {
    const q = ev.payload?.question || ev.payload?.studentQuestion;
    if (!q || typeof q !== 'string') continue;
    const normalized = normalizeQuestion(q);
    const key = normalized.split(' ').slice(0, firstWords).join(' ');
    counts[key] = (counts[key] || 0) + 1;
  }

  const items = Object.entries(counts).map(([pattern, count]) => ({ pattern, count }));
  items.sort((a, b) => b.count - a.count);
  return items;
}
