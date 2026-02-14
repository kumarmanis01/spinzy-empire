import { TopicExplanationRequest, TopicExplanationResponse } from './types';
import { generateNotes } from '@/lib/ai/prompts';

export async function handleTopicExplanation(
  req: TopicExplanationRequest
): Promise<TopicExplanationResponse> {
  try {
    const input = {
      grade: 5,
      board: 'CBSE',
      language: 'English',
      subject: 'General',
      chapter: 'Overview',
      topic: req.topicId ?? 'General Topic',
      topicId: req.topicId,
      explanationLevel: req.depth === 'summary' ? 'simple' : 'detailed',
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
