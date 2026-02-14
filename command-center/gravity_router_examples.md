# Gravity Router — Example Routing Outputs

This file contains deterministic example inputs and their corresponding outputs
for `routeNextApp` implemented in `command-center/gravity_router.ts`.

1) Repeated topic from a generic reader

Input:
```
{ currentApp: 'reader', capabilityUsed: 'topic_explanation', usageSignals: { repeatedTopic: true } }
```

Output:
```
{ recommendedApp: 'topic-explainer', reason: 'Repeated topic detected — provide a focused topic explanation.' }
```

2) Repeated topic but already on the explainer

Input:
```
{ currentApp: 'topic-explainer', capabilityUsed: 'topic_explanation', usageSignals: { repeatedTopic: true } }
```

Output:
```
{ recommendedApp: 'revision-strategy', reason: 'Topic repeated after explanation — suggest a revision strategy to reinforce learning.' }
```

3) High doubt frequency after a quiz

Input:
```
{ currentApp: 'quiz', capabilityUsed: 'assessment', usageSignals: { highDoubtFrequency: true } }
```

Output:
```
{ recommendedApp: 'doubt-solver', reason: 'Frequent doubts detected — recommend doubt resolution.' }
```

4) Exam mode engaged during practice

Input:
```
{ currentApp: 'practice', capabilityUsed: 'practice', usageSignals: { examMode: true } }
```

Output:
```
{ recommendedApp: 'exam-booster', reason: 'User in exam mode — prioritize focused exam booster.' }
```

These examples are deterministic and based only on simple if/else rules (no AI/ML).
