"use client"

import React from 'react'
import Link from 'next/link'

export interface ResultScreenProps {
  result: any
  currentSlug?: string
}

export function ResultScreen({ result, currentSlug }: ResultScreenProps) {
  React.useEffect(() => {
    if (!result) return
    try {
      const stored = JSON.parse(localStorage.getItem('topicInterest') || '{}')
      let topic: string | null = null
      if (currentSlug) topic = currentSlug.replace(/-explainer$/, '').replace(/-/g, ' ')
      if (!topic) {
        const payload = result?.payload || result
        if (typeof payload?.question === 'string') topic = payload.question
        else if (typeof result?.question === 'string') topic = result.question
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
  }, [result, currentSlug])
  const payload = result?.payload || result
  const nextSlug = payload?.nextSlug
  const nextApps = nextSlug ? (Array.isArray(nextSlug) ? nextSlug : [nextSlug]) : []

  return (
    <div>
      <h3>Result</h3>
      <pre>{JSON.stringify(result, null, 2)}</pre>

      {nextApps.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-medium">Next Recommended</h3>
          <div className="mt-2 space-y-2">
            {nextApps.map((slug) => (
              <Link key={slug} href={`/apps/${slug}`} className="text-blue-600 underline">
                Continue to {slug.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
