import { RevisionStrategyRequest, RevisionStrategyResponse } from './types';
import { generateDailyTaskAI } from '@/lib/ai/tools/generateDailyTask';

export async function handleRevisionStrategy(
  req: RevisionStrategyRequest
): Promise<RevisionStrategyResponse> {
  try {
    const profile = {
      grade: (req.topicIds && req.topicIds.length) ? 5 : 5,
      language: 'English',
      last_active_days_ago: 0,
    } as any;

    const context = {
      current_topic: req.topicIds?.[0] ?? 'general revision',
      difficulty_level: Math.max(1, Math.min(3, Math.floor((req.timeAvailableMinutes ?? 15) / 10))),
    } as any;

    const task = await generateDailyTaskAI(profile, context);

    return {
      strategyId: String(Date.now()),
      steps: task.steps as unknown as Array<Record<string, unknown>>,
    };
  } catch (err) {
    return { steps: [] };
  }
}
