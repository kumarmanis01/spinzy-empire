export interface StudyPlanningRequest {
  userId: string;
  objective?: string;
  constraints?: Record<string, unknown>;
}

export interface StudyPlanningResponse {
  planId?: string;
  outline?: Record<string, unknown>;
  summary?: string;
}
