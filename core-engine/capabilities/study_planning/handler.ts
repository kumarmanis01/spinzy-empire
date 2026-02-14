import { StudyPlanningRequest, StudyPlanningResponse } from './types';
import { createFirstWeekPlan } from '@/lib/onboarding/firstWeekOrchestrator';

export async function handleStudyPlanning(
  req: StudyPlanningRequest
): Promise<StudyPlanningResponse> {
  try {
    // Minimal mapping: accept optional grade/subject from constraints, else use safe defaults
    const grade = (req.constraints?.['grade'] as any) ?? 5;
    const subject = (req.constraints?.['subject'] as any) ?? 'General';

    const plan = createFirstWeekPlan(req.userId, grade, subject);

    return {
      planId: plan.createdAt,
      outline: plan as unknown as Record<string, unknown>,
      summary: `First week plan for ${subject}`,
    };
  } catch (err) {
    // Minimal error handling — do not expose internals
    return {
      summary: 'failed',
    };
  }
}
