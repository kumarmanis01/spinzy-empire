import { TopicExplanationRequest, TopicExplanationResponse } from './types';
import { generateNotes } from '@/lib/ai/prompts';

export async function handleTopicExplanation(
  req: TopicExplanationRequest
): Promise<TopicExplanationResponse> {
  try {
    // Accept both the new standardized shape and legacy fields.
    const topic = req.topicId ?? req.question ?? 'General Topic';
    const language = req.context?.language ?? 'English';
    const grade = req.context?.grade ?? 5;
    const board = req.context?.board ?? 'CBSE';
    const subject = req.context?.subject ?? 'General';
    const depth = req.depth ?? 'summary';

    const input = {
      grade,
      board,
      language,
      subject,
      chapter: 'Overview',
      topic,
      topicId: req.topicId,
      explanationLevel: depth === 'summary' ? 'simple' : 'detailed',
      preferredLength: 'medium',
    } as any;

    const result = await generateNotes(input, req.userId, 'session-local');

    const explanation = result.data?.coreExplanation?.map(s => s.content).join('\n\n') ?? undefined;

    return {
      explanation,
      examples: result.data?.workedExamples ?? undefined,
    };
  } catch (err) {
    return {};
  }
}
