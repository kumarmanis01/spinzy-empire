export type DailySummary = {
  topCapabilities: Array<{ capability: string; count: number }>;
  topSubjects: Array<{ subject: string; count: number }>;
  highFrequencyTopics: Array<{ pattern: string; count: number }>;
  languageDistribution: Record<string, number>;
};

export type TrendResult = {
  totalEvents: number;
  capabilityMap: Record<string, number>;
  subjectMap: Record<string, number>;
  topicMap: Record<string, number>;
  languageMap: Record<string, number>;
};

/**
 * Derive simple trend maps from the daily summary. Pure deterministic logic.
 */
export function detectTrends(summary: DailySummary): TrendResult {
  const capabilityMap: Record<string, number> = {};
  const subjectMap: Record<string, number> = {};
  const topicMap: Record<string, number> = {};
  const languageMap: Record<string, number> = {};

  let totalEvents = 0;

  for (const c of summary.topCapabilities) {
    capabilityMap[c.capability] = c.count;
    totalEvents += c.count;
  }

  for (const s of summary.topSubjects) {
    subjectMap[s.subject] = s.count;
  }

  for (const t of summary.highFrequencyTopics) {
    topicMap[t.pattern] = t.count;
  }

  for (const [lang, count] of Object.entries(summary.languageDistribution || {})) {
    languageMap[lang] = count;
  }

  return { totalEvents: Math.max(1, totalEvents), capabilityMap, subjectMap, topicMap, languageMap };
}
