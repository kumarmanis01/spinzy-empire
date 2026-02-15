'use client';

import { useEffect } from 'react';
import { invokeCapability } from '@/core-engine/capability_surface';

export default function CapabilityRuntimeBridge() {
  useEffect(() => {
    if (typeof globalThis !== 'undefined' && !(globalThis as any).__capabilityInvoke) {
      (globalThis as any).__capabilityInvoke = invokeCapability;
    }
    // intentionally do not unset the global invoker on unmount
  }, []);

  return null;
}
