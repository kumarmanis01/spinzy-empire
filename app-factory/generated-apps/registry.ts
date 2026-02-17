export const GeneratedApps: Record<string, () => Promise<any>> = {
  "topic-explanation": () => import("./topic-explanation/onboarding/App"),
  "math-quick-tips": () => import("./math-quick-tips/onboarding/App"),
  "quick-solver": () => import("./quick-solver/onboarding/App"),
  "sample-auto-config": () => import("./sample-auto-config/onboarding/App"),
  "test-registry3": () => import("./test-registry3/onboarding/App"),
  "algebra-explainer": () => import("./algebra-explainer/onboarding/App"),
  "linear-algebra-explainer": () => import("./linear-algebra-explainer/onboarding/App"),
};

export default GeneratedApps;
