'use client';

import { useEffect } from 'react';

// Client-side invoker: forward capability requests to server API.
// Avoid importing server-only modules here to prevent bundling server code into client.
export default function ClientCapabilityInvoker() {
  useEffect(() => {
    if (typeof globalThis === 'undefined') return;

    if (!(globalThis as any).__capabilityInvoke) {
      (globalThis as any).__capabilityInvoke = async (capability: string, payload: any) => {
        try {
          const res = await fetch('/api/capability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ capability, payload }),
          });
          return await res.json();
        } catch (err) {
          return { success: false, error: String(err) };
        }
      };
    }

    // intentionally do not unset the invoker on unmount
  }, []);

  return null;
}
