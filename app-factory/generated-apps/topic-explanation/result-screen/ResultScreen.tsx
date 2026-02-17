"use client"

import React from 'react'

export function ResultScreen({ data, onBack }: { data: any; onBack: () => void }) {
  React.useEffect(() => {
    if (!data) return
    try {
      const stored = JSON.parse(localStorage.getItem('topicInterest') || '{}')

      // derive topic from common fields
      let topic: string | null = null
      if (typeof data?.question === 'string') topic = data.question
      else if (typeof data?.query === 'string') topic = data.query
      else if (typeof data?.topic === 'string') topic = data.topic
      else if (data?.payload?.question) topic = data.payload.question

      // fallback: derive from URL slug (/apps/{slug})
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
      if (!topic) return

      const key = topic
      const now = Date.now()
      const prev = stored[key] || { count: 0, lastViewed: 0 }
      stored[key] = { count: (prev.count || 0) + 1, lastViewed: now }
      localStorage.setItem('topicInterest', JSON.stringify(stored))
    } catch {
      // ignore
    }
  }, [data])

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Explanation Result</h4>
      <pre style={{ background: '#f8f8f8', padding: 8 }}>{JSON.stringify(data, null, 2)}</pre>
      <div style={{ marginTop: 8 }}>
        <button onClick={onBack}>Back</button>
      </div>
    </div>
  )
}

export default ResultScreen
