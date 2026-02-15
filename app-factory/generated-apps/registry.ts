export const GeneratedApps: Record<string, () => Promise<any>> = {
  "algebra-explainer": () => import("./algebra-explainer/onboarding/App"),

  "photosynthesis-explainer": () => import("./photosynthesis-explainer/onboarding/App"),

  "linear-algebra-explainer": () => import("./linear-algebra-explainer/onboarding/App"),
};

export default GeneratedApps;
