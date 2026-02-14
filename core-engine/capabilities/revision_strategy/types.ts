export interface RevisionStrategyRequest {
  userId: string;
  topicIds?: string[];
  timeAvailableMinutes?: number;
}

export interface RevisionStrategyResponse {
  strategyId?: string;
  steps?: Array<Record<string, unknown>>;
}
