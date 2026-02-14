/**
 * Gravity Router — deterministic micro-app recommendation utility
 *
 * INPUT: { currentApp, capabilityUsed, usageSignals }
 * OUTPUT: { recommendedApp, reason }
 *
 * Rules:
 * - Deterministic if/else rules only
 * - No AI/ML, no DB, no UI changes
 * - Simple, readable routing priorities
 */

export type UsageSignals = {
  repeatedTopic?: boolean
  highDoubtFrequency?: boolean
  examMode?: boolean
  lowConsistency?: boolean
  topic?: string
}

export interface GravityInput {
  currentApp: string
  capabilityUsed: string
  usageSignals: UsageSignals
}

export interface GravityOutput {
  recommendedApp: string
  reason: string
}

/**
 * routeNextApp
 * Priority (highest -> lowest): examMode, highDoubtFrequency, repeatedTopic, lowConsistency, capability heuristics, fallback
 */
export function routeNextApp(input: GravityInput): GravityOutput {
  const { currentApp, capabilityUsed, usageSignals } = input
  const { repeatedTopic, highDoubtFrequency, examMode, lowConsistency } = usageSignals || {}
  const topic = usageSignals?.topic

  // 1) Exam mode is top priority
  if (examMode) {
    return {
      recommendedApp: 'exam-booster',
      reason: 'User in exam mode — prioritize focused exam booster.'
    }
  }

  // 2) Many doubts → route to doubt solver
  if (highDoubtFrequency) {
    return {
      recommendedApp: 'doubt-solver',
      reason: 'Frequent doubts detected — recommend doubt resolution.'
    }
  }

  // 3) Repeated topic seen: prefer topic explainer; if already saw explainer, suggest revision
  // 2.5) Topic-specific rules (e.g., algebra)
  if (topic && /algebra/i.test(topic)) {
    return {
      recommendedApp: 'algebra-explainer',
      reason: 'Topic mentions algebra — suggest the algebra explainer.'
    }
  }
  if (repeatedTopic) {
    if (currentApp === 'topic-explainer' || currentApp === 'topic-explanation') {
      return {
        recommendedApp: 'revision-strategy',
        reason: 'Topic repeated after explanation — suggest a revision strategy to reinforce learning.'
      }
    }
    return {
      recommendedApp: 'topic-explainer',
      reason: 'Repeated topic detected — provide a focused topic explanation.'
    }
  }

  // 4) Low consistency — suggest study planner
  if (lowConsistency) {
    return {
      recommendedApp: 'study-planner',
      reason: 'Low study consistency observed — recommend a small plan to improve cadence.'
    }
  }

  // 5) Heuristic based on capability used
  if (capabilityUsed === 'topic_explanation') {
    return {
      recommendedApp: 'practice-sets',
      reason: 'After topic explanations, next logical step is practice sets.'
    }
  }

  if (capabilityUsed === 'study_planning') {
    return {
      recommendedApp: 'daily-tasks',
      reason: 'Following a study plan, suggest daily tasks to execute the plan.'
    }
  }

  // 6) Fallback default
  return {
    recommendedApp: 'study-planner',
    reason: 'Default recommendation: suggest the study planner to guide next steps.'
  }
}

/** Example deterministic routing outputs (kept inline for easy reference):
 *
 * routeNextApp({ currentApp: 'reader', capabilityUsed: 'topic_explanation', usageSignals: { repeatedTopic: true } })
 * => { recommendedApp: 'topic-explainer', reason: 'Repeated topic detected — provide a focused topic explanation.' }
 *
 * routeNextApp({ currentApp: 'topic-explainer', capabilityUsed: 'topic_explanation', usageSignals: { repeatedTopic: true } })
 * => { recommendedApp: 'revision-strategy', reason: 'Topic repeated after explanation — suggest a revision strategy to reinforce learning.' }
 *
 * routeNextApp({ currentApp: 'quiz', capabilityUsed: 'assessment', usageSignals: { highDoubtFrequency: true } })
 * => { recommendedApp: 'doubt-solver', reason: 'Frequent doubts detected — recommend doubt resolution.' }
 *
 * routeNextApp({ currentApp: 'practice', capabilityUsed: 'practice', usageSignals: { examMode: true } })
 * => { recommendedApp: 'exam-booster', reason: 'User in exam mode — prioritize focused exam booster.' }
 */

export default routeNextApp
