export type CapabilityResponse = {
  success: boolean
  data?: any
  error?: string
}

/**
 * Minimal client that routes requests to capability handlers.
 * This thin client intentionally does NOT import legacy modules directly from UI.
 * The real runtime should wire capability names to server APIs or IPC.
 */
export async function callCapability(capabilityName: string, payload: any): Promise<CapabilityResponse> {
  // Thin transport: delegate to runtime invoker and return its response as-is.
  // @ts-ignore
  if (typeof (globalThis as any).__capabilityInvoke !== 'function') {
    return { success: false, error: 'capability-invoke-not-available' }
  }

  // @ts-ignore
  return await (globalThis as any).__capabilityInvoke(capabilityName, payload)
}

export default callCapability
