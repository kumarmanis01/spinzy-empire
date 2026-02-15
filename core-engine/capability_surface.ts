import { handleTopicExplanation } from './capabilities/topic_explanation/handler';
import { handleDoubtSolving } from './capabilities/doubt_solving/handler';
import { handleStudyPlanning } from './capabilities/study_planning/handler';
import { handleRevisionStrategy } from './capabilities/revision_strategy/handler';

type CapabilityName =
  | 'topic_explanation'
  | 'doubt_solving'
  | 'study_planning'
  | 'revision_strategy';

export async function invokeCapability(
  capability: CapabilityName,
  payload: any
) {
  try {
    switch (capability) {
      case 'topic_explanation':
        return await handleTopicExplanation(payload);

      case 'doubt_solving':
        return await handleDoubtSolving(payload);

      case 'study_planning':
        return await handleStudyPlanning(payload);

      case 'revision_strategy':
        return await handleRevisionStrategy(payload);

      default:
        return {
          success: false,
          error: `Unknown capability: ${capability}`,
        };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Capability execution failed',
    };
  }
}

