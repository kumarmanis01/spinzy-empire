export interface TopicExplanationRequest {
  userId: string;
  topicId: string;
  depth?: 'summary' | 'detailed' | 'tutorial';
}

export interface TopicExplanationResponse {
  explanation?: string;
  examples?: Array<Record<string, unknown>>;
}
