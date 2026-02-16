export type CapabilityResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

/**
 * Minimal client that routes requests to capability handlers.
 * This thin client intentionally does NOT import legacy modules directly from UI.
 * The real runtime should wire capability names to server APIs or IPC.
 */
export async function callCapability(capabilityName: string, payload: any): Promise<CapabilityResponse> {
  // Client-side shim: call a global endpoint if available.
  // In this template we attempt to call a runtime-provided global handler if present.
  try {
    if (typeof (globalThis as any).__capabilityInvoke === 'function') {
      const res = await (globalThis as any).__capabilityInvoke(capabilityName, payload);
      return { success: true, data: res };
    }

    // Fallback: no runtime available — return a standardized not-available response
    return { success: false, error: 'capability-invoke-not-available' };
  } catch (err: any) {
    return { success: false, error: err?.message ?? 'unknown' };
  }
}
