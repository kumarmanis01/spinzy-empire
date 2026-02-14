import type { UsageEvent } from './usage_tracker';

/**
 * Return counts of capability usage sorted desc.
 * Pure utility.
 */
export function topCapabilities(events: UsageEvent[], topN = 10) {
  const counts: Record<string, number> = {};
  for (const ev of events) {
    counts[ev.capability] = (counts[ev.capability] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([capability, count]) => ({ capability, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

/**
 * Return top subjects from payload.subject when available.
 */
export function topSubjects(events: UsageEvent[], topN = 10) {
  const counts: Record<string, number> = {};
  for (const ev of events) {
    const subj = ev.payload?.subject || ev.payload?.topic || 'unknown';
    counts[subj] = (counts[subj] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([subject, count]) => ({ subject, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}
