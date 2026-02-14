import { generateDailySummary, DailySummary } from '../data-intelligence/reports/daily_summary';
import { generateCandidatesFromSummary } from '../data-intelligence/app-suggester/app_idea_generator';

export interface ArchitectReport {
  date: string;
  topCapabilities: Array<{ capability: string; count: number }>;
  biggestStudentStruggles: Array<{ pattern: string; count: number }>;
  recommendedNextApps: Array<{
    name: string;
    impactScore: number;
    buildComplexity: 'low' | 'medium' | 'high';
    reason: string;
  }>;
  immediateAction: string;
}

/**
 * Generate a single daily architect report.
 * Deterministic logic only; no external calls beyond reading existing summaries.
 */
export async function generateArchitectReport(threshold = 50): Promise<ArchitectReport> {
  const summary: DailySummary = await generateDailySummary();
  const ideas = generateCandidatesFromSummary(summary);

  // Pick top 1-2 ideas whose impactScore >= threshold
  const qualified = ideas.filter((i) => (i.impactScore ?? 0) >= threshold).slice(0, 2);

  const recommendedNextApps = qualified.map((i) => ({
    name: i.name,
    impactScore: i.impactScore ?? 0,
    buildComplexity: i.buildComplexity ?? 'medium',
    reason: i.reason ?? '',
  }));

  // Biggest student struggles: top 3 frequency topics from summary
  const biggestStudentStruggles = (summary.highFrequencyTopics || []).slice(0, 3).map((t) => ({ pattern: t.pattern, count: t.count }));

  // Top capabilities snapshot
  const topCapabilities = (summary.topCapabilities || []).slice(0, 5).map((c) => ({ capability: c.capability, count: c.count }));

  let immediateAction = '';
  if (recommendedNextApps.length === 0) {
    immediateAction = 'Impact below threshold — collect more data (run summary for 3 more days) and continue passive tracking.';
  } else {
    const top = recommendedNextApps[0];
    if (top.buildComplexity === 'low') {
      immediateAction = `Prototype a thin-client pilot for "${top.name}" using capability ${top.name.includes('Revision') ? 'revision_strategy' : 'doubt_solving'}. Aim for <2 week MVP.`;
    } else if (top.buildComplexity === 'medium') {
      immediateAction = `Design a small pilot that composes ${top.buildComplexity} capabilities for "${top.name}" and validate with 5 power-users.`;
    } else {
      immediateAction = `High complexity for "${top.name}" — create an RFC and spike to validate feasibility.`;
    }
  }

  return {
    date: new Date().toISOString(),
    topCapabilities,
    biggestStudentStruggles,
    recommendedNextApps,
    immediateAction,
  };
}

// If run directly, print JSON (machine-readable + human-friendly)
if (require.main === module) {
  (async () => {
    const report = await generateArchitectReport();
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(report, null, 2));
  })();
}
