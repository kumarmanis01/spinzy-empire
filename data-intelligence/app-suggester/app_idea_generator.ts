import { DailySummary } from '../reports/daily_summary';
import { detectTrends, TrendResult } from './trend_detector';
import { scoreIdeas, IdeaCandidate } from './priority_ranker';

/**
 * Generate candidate ideas from summary using deterministic heuristics.
 */
export function generateCandidatesFromSummary(summary: DailySummary): IdeaCandidate[] {
  const trends: TrendResult = detectTrends(summary);

  const candidates: IdeaCandidate[] = [];

  // 1) For each top topic, propose an explain/solve app depending on keywords
  for (const t of summary.highFrequencyTopics.slice(0, 15)) {
    const pat = t.pattern.toLowerCase();
    if (pat.includes('explain') || pat.includes('what is') || pat.includes('why')) {
      candidates.push({
        name: `${capitalizeFirstWords(pat, 3)} Explainer`,
        problem: `Students ask about "${t.pattern}" frequently and need concise explanations.`,
        requiredCapability: 'topic_explanation',
        reason: `High frequency topic (${t.count} mentions)`,
      });
    } else if (pat.includes('how to') || pat.includes('solve') || pat.includes('steps') || pat.includes('calculate') || pat.includes('what is 2+2')) {
      candidates.push({
        name: `${capitalizeFirstWords(pat, 3)} Quick Solver`,
        problem: `Students repeatedly ask procedural questions like "${t.pattern}" needing worked solutions.`,
        requiredCapability: 'doubt_solving',
        reason: `High frequency topic (${t.count} mentions)`,
      });
    } else if (pat.includes('revise') || pat.includes('revision') || pat.includes('quick revision')) {
      candidates.push({
        name: `${capitalizeFirstWords(pat, 3)} Revision Sprint`,
        problem: `Frequent requests for quick revision on "${t.pattern}".`,
        requiredCapability: 'revision_strategy',
        reason: `Revision need (${t.count} mentions)`,
      });
    } else {
      // default: micro-note or study plan snippet
      candidates.push({
        name: `${capitalizeFirstWords(pat, 3)} Micro-Lesson`,
        problem: `Repeated interest in "${t.pattern}" suggests a short lesson would help.`,
        requiredCapability: 'study_planning',
        reason: `Topic popularity (${t.count} mentions)`,
      });
    }
  }

  // 2) For top subjects, propose language-specific explainers if language distribution shows a non-zero count
  for (const s of summary.topSubjects.slice(0, 5)) {
    candidates.push({
      name: `${s.subject} Quick Tips`,
      problem: `Short tips for ${s.subject} to address frequent student questions.`,
      requiredCapability: 'study_planning',
      reason: `High subject activity (${s.count})`,
    });
  }

  // 3) Generic cross-cutting low-complexity ideas
  candidates.push({
    name: 'Revision Sprint Planner',
    problem: 'Create short, time-boxed revision sprints based on recent high-frequency topics.',
    requiredCapability: 'revision_strategy',
    reason: 'Common revision needs across topics',
  });

  candidates.push({
    name: 'Topic Clarify Chat',
    problem: 'Quick clarification chat powered by doubt resolution capabilty.',
    requiredCapability: 'doubt_solving',
    reason: 'High doubts observed in analytics',
  });

  // Score and rank
  const ranked = scoreIdeas(candidates, trends);
  return ranked;
}

function capitalizeFirstWords(s: string, n = 2) {
  const words = s.split(' ').filter(Boolean);
  return words.slice(0, n).map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ');
}
