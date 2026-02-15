export interface TopicExplanationRequest {
  // Standardized request shape (preferred):
  // `question` should contain the topic or natural-language prompt.
  question?: string;
  context?: {
    language?: string;
    grade?: number;
    board?: string;
    subject?: string;
  };

  // Legacy/backwards-compatible fields (some callers still send these)
  userId?: string;
  topicId?: string;
  depth?: 'summary' | 'detailed' | 'tutorial';
}

export interface TopicExplanationResponse {
  explanation?: string;
  examples?: Array<Record<string, unknown>>;
}
