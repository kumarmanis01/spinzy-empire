"use client";

import React from 'react';

export interface ResultScreenProps {
  result: any;
}

export function ResultScreen({ result }: ResultScreenProps) {
  React.useEffect(() => {
    if (!result) return
    try {
      const stored = JSON.parse(localStorage.getItem('topicInterest') || '{}')
      let topic: string | null = null
      if (typeof result?.question === 'string') topic = result.question
      else if (typeof result?.payload?.question === 'string') topic = result.payload.question
      if (!topic) {
        try {
          const m = window.location.pathname.match(/\/apps\/([^\/]+)/)
          if (m) topic = m[1].replace(/-explainer$/, '').replace(/-/g, ' ')
        } catch {
          // ignore
        }
      }
      if (!topic) return
      topic = String(topic).trim()
      const key = topic
      const now = Date.now()
      const prev = stored[key] || { count: 0, lastViewed: 0 }
      stored[key] = { count: (prev.count || 0) + 1, lastViewed: now }
      localStorage.setItem('topicInterest', JSON.stringify(stored))
    } catch {
      // ignore
    }
  }, [result])

  return (
    <div>
      <h3>Result</h3>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
