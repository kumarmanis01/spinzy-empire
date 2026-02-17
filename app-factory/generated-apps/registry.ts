export const GeneratedApps: Record<string, () => Promise<any>> = {
  "topic-explanation": () => import("./topic-explanation/onboarding/App"),
  "math-quick-tips": () => import("./math-quick-tips/onboarding/App"),
  "quick-solver": () => import("./quick-solver/onboarding/App"),
  "sample-auto-config": () => import("./sample-auto-config/onboarding/App"),
  };

export default GeneratedApps;
