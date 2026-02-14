export interface DoubtSolvingRequest {
  userId: string;
  question: string;
  context?: Record<string, unknown>;
}

export interface DoubtSolvingResponse {
  answer?: string;
  references?: string[];
}
