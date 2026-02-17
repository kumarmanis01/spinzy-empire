"use client"

import React from 'react'

export interface ResultScreenProps {
  data: any
  onBack?: () => void
}

export function ResultScreen({ data, onBack }: ResultScreenProps) {
  React.useEffect(() => {
    if (!data) return
    try {
      const stored = JSON.parse(localStorage.getItem('topicInterest') || '{}')
      let topic: string | null = null
      if (typeof data?.question === 'string') topic = data.question
      else if (typeof data?.payload?.question === 'string') topic = data.payload.question
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
  }, [data])

  if (!data.success) {
    return (
      <div>
        <h4>Failed</h4>
        <p>{data.error || 'Unknown error'}</p>
        <button onClick={onBack}>Back</button>
      </div>
    )
  }

  const payload = data.payload || data

  return (
    <div>
      <h4>Solution</h4>
      <div>
        <strong>Answer:</strong>
        <p>{payload.answer || payload.solution || 'No solution returned'}</p>
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={onBack}>Back</button>
      </div>
    </div>
  )
}

export default ResultScreen
