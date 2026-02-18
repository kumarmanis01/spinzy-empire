"use client"

import React, { useState } from 'react'
import { callCapability } from '../services/capabilityClient'
import config from '../../../app-config/${APP_NAME}.json'

export function InputScreen({ onResult }: { onResult: (data: any) => void }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await callCapability(config.capability, {
        question: query,
        context: {},
      })
      onResult(res)
    } catch (e) {
      onResult({ success: false })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your topic..."
        style={{ width: '100%', padding: 8 }}
      />

      <button onClick={submit} disabled={loading} style={{ marginTop: 12 }}>
        {loading ? 'Processing...' : 'Run'}
      </button>
    </div>
  )
}

export default InputScreen
