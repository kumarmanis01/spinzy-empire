import { handleTopicExplanation } from './capabilities/topic_explanation/handler';
import { handleDoubtSolving } from './capabilities/doubt_solving/handler';
import { handleStudyPlanning } from './capabilities/study_planning/handler';
import { handleRevisionStrategy } from './capabilities/revision_strategy/handler';
import { logger } from '@/lib/logger';

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
      case 'topic_explanation': {
        const result = await handleTopicExplanation(payload);
        logger.info('CAP_SURFACE: topic_explanation RESULT TYPE', { type: typeof result });
        logger.info('CAP_SURFACE: topic_explanation RESULT KEYS', { keys: Object.keys(result || {}) });
        logger.info('RAW_HANDLER_RESULT', { result });
        return { success: true, data: result };
      }

      case 'doubt_solving': {
        const result = await handleDoubtSolving(payload);
        return { success: true, data: result };
      }

      case 'study_planning': {
        const result = await handleStudyPlanning(payload);
        return { success: true, data: result };
      }

      case 'revision_strategy': {
        const result = await handleRevisionStrategy(payload);
        return { success: true, data: result };
      }

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

