import { DoubtSolvingRequest, DoubtSolvingResponse } from './types';
import { generateDoubtResponse } from '@/lib/ai/prompts';

export async function handleDoubtSolving(
  req: DoubtSolvingRequest
): Promise<DoubtSolvingResponse> {
  try {
    const input = {
      grade: (req.context?.['grade'] as any) ?? 5,
      board: (req.context?.['board'] as any) ?? 'CBSE',
      language: (req.context?.['language'] as any) ?? 'English',
      subject: (req.context?.['subject'] as any) ?? 'General',
      chapter: (req.context?.['chapter'] as any) ?? '',
      topic: (req.context?.['topic'] as any) ?? '',
      topicId: (req.context?.['topicId'] as any) ?? undefined,
      studentQuestion: req.question,
      studentIntent: (req.context?.['studentIntent'] as any) ?? 'conceptual_clarity',
      conversationHistory: (req.context?.['conversationHistory'] as any) ?? undefined,
    } as any;

    const result = await generateDoubtResponse(input, req.userId, 'session-local');

    return {
      answer: result.data?.response ?? undefined,
      references: undefined,
    };
  } catch (err) {
    return { answer: 'error' };
  }
}
