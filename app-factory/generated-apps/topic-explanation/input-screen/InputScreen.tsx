"use client"

import React, { useEffect, useState } from 'react'
import { callCapability } from '../services/capabilityClient'
import config from '../config.json'

export interface InputScreenProps {
  onResult: (data: any) => void
  initialQuery?: string
}

export function InputScreen({ onResult, initialQuery }: InputScreenProps) {
  const [query, setQuery] = useState(initialQuery ?? '')
  const [language, setLanguage] = useState<string>('English')
  const [loading, setLoading] = useState(false)

  async function explain() {
    setLoading(true)
    try {
      const payload = { question: query, context: { language } }
      const res = await callCapability(config.capability, payload)
      if (res && (res as any).success === true) {
        try {
          const raw = localStorage.getItem('topicInterest') || '{}';
          const existing = JSON.parse(raw);
          const now = Date.now();
          const key = query.trim();
          const prev = existing[key] || { count: 0, lastViewed: 0 };
          existing[key] = {
            count: (prev.count || 0) + 1,
            lastViewed: now,
          };
          localStorage.setItem('topicInterest', JSON.stringify(existing));
          localStorage.setItem('lastCapability', config.capability);
        } catch (_) {
          // ignore localStorage errors (e.g., SSR or privacy settings)
        }
      }
      onResult(res)
    } catch (_err) {
      onResult({ success: false, error: 'invoke-failed' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery && initialQuery.trim().length > 0) explain()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Explain a topic</h4>
      <div>
        <label>Topic query:</label>
        <div>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter topic or question" style={{ width: '60%' }} />
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Language: </label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option>English</option>
          <option>Hindi</option>
        </select>
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={explain} disabled={loading}>{loading ? 'Explaining...' : 'Get Explanation'}</button>
      </div>
    </div>
  )
}

export default InputScreen
