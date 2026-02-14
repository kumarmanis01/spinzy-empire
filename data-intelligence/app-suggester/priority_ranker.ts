import { TrendResult } from './trend_detector';

export type IdeaCandidate = {
  name: string;
  problem: string;
  requiredCapability: string;
  impactScore?: number;
  buildComplexity?: 'low' | 'medium' | 'high';
  reason?: string;
};

/**
 * Simple normalizer to [0,1]
 */
function normalize(value: number, max: number) {
  if (max <= 0) return 0;
  return Math.min(1, value / max);
}

/**
 * Heuristic complexity estimate based on required capability and keywords
 */
function estimateComplexity(requiredCapability: string, extraCapabilities: string[] = []): 'low' | 'medium' | 'high' {
  const lowCaps = new Set(['study_planning', 'doubt_solving', 'topic_explanation', 'revision_strategy']);
  const multi = extraCapabilities.length > 0;
  if (lowCaps.has(requiredCapability) && !multi) return 'low';
  if (lowCaps.has(requiredCapability) && multi) return 'medium';
  return 'high';
}

/**
 * Score an idea deterministically using trends.
 * impactScore in [0..100]
 */
export function scoreIdeas(candidates: IdeaCandidate[], trends: TrendResult): IdeaCandidate[] {
  const maxCap = Math.max(...Object.values(trends.capabilityMap), 1);
  const maxTopic = Math.max(...Object.values(trends.topicMap), 1);
  const maxSubject = Math.max(...Object.values(trends.subjectMap), 1);

  return candidates.map((c) => {
    const capCount = trends.capabilityMap[c.requiredCapability] ?? 0;

    // estimate topic relevance by checking if candidate name or problem matches top topics
    let topicMatchCount = 0;
    for (const [pattern, count] of Object.entries(trends.topicMap)) {
      if (c.name.toLowerCase().includes(pattern.toLowerCase()) || c.problem.toLowerCase().includes(pattern.toLowerCase())) {
        topicMatchCount += count;
      }
    }

    // subject signal: check top subject counts mentioned in reason or name
    let subjectSignal = 0;
    for (const [subject, count] of Object.entries(trends.subjectMap)) {
      if ((c.reason || '').toLowerCase().includes(subject.toLowerCase()) || c.name.toLowerCase().includes(subject.toLowerCase())) {
        subjectSignal += count;
      }
    }

    // Normalize
    const capScore = normalize(capCount, maxCap);
    const topicScore = normalize(topicMatchCount, maxTopic);
    const subjectScore = normalize(subjectSignal, maxSubject);

    // Weighted sum: capability reuse favored, then topical frequency, then subject alignment
    const impact = 0.55 * capScore + 0.35 * topicScore + 0.10 * subjectScore;
    const impactScore = Math.round(impact * 100);

    const complexity = estimateComplexity(c.requiredCapability);

    return {
      ...c,
      impactScore,
      buildComplexity: complexity,
    };
  }).sort((a, b) => (b.impactScore ?? 0) - (a.impactScore ?? 0));
}
