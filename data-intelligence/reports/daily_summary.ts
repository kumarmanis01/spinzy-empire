import { getUsageEvents } from '../analytics/usage_tracker';
import { topCapabilities, topSubjects } from '../analytics/feature_usage';
import { aggregateQuestionPatterns } from '../analytics/question_patterns';

export interface DailySummary {
  topCapabilities: Array<{ capability: string; count: number }>;
  topSubjects: Array<{ subject: string; count: number }>;
  highFrequencyTopics: Array<{ pattern: string; count: number }>;
  languageDistribution: Record<string, number>;
}

/** Generate a daily summary JSON. Pure function that reads the usage store. */
export async function generateDailySummary(): Promise<DailySummary> {
  const events = await getUsageEvents();

  const caps = topCapabilities(events, 10);
  const subjects = topSubjects(events, 10);
  const patterns = aggregateQuestionPatterns(events, 5).slice(0, 20);

  const languageDistribution: Record<string, number> = {};
  for (const ev of events) {
    const lang = ev.payload?.language || 'unknown';
    languageDistribution[lang] = (languageDistribution[lang] || 0) + 1;
  }

  return {
    topCapabilities: caps,
    topSubjects: subjects,
    highFrequencyTopics: patterns.map((p) => ({ pattern: p.pattern, count: p.count })),
    languageDistribution,
  };
}

// If run directly, print JSON to stdout (node friendly)
if (require.main === module) {
  (async () => {
    const summary = await generateDailySummary();
    // Structured JSON only
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(summary, null, 2));
  })();
}
