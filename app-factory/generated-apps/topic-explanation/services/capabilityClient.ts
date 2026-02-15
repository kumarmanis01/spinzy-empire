export type CapabilityResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

export async function callCapability(capabilityName: string, payload: any): Promise<CapabilityResponse> {
  try {
    if (typeof (globalThis as any).__capabilityInvoke === 'function') {
      const res = await (globalThis as any).__capabilityInvoke(capabilityName, payload);
      return { success: true, data: res };
    }
    return { success: false, error: 'capability-invoke-not-available' };
  } catch (err: any) {
    return { success: false, error: err?.message ?? 'unknown' };
  }
}
