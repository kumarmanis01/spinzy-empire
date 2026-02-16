import React, { useState } from 'react'
import { callCapability } from '../services/capabilityClient'
import config from '../../../app-config/quick-solver.json';

export interface InputScreenProps {
  onResult: (data: any) => void
}

export function InputScreen({ onResult }: InputScreenProps) {
  const [language, setLanguage] = useState<string>(config.languageOptions[0])
  const [question, setQuestion] = useState<string>('')
  const [loading, setLoading] = useState(false)

  async function solve() {
    setLoading(true)
    try {
      const payload = {
        userId: 'demo-user',
        mode: config.defaultMode,
        questionText: question,
        language,
      }
      const res = await callCapability(config.capability, payload)
      onResult(res)
    } catch (err) {
      onResult({ success: false, error: 'invoke-failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Quick Solver</h4>
      <div>
        <label>Language: </label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {config.languageOptions.map((l: string) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 8 }}>
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter question" rows={4} style={{ width: '100%' }} />
      </div>

      <div style={{ marginTop: 8 }}>
        <button onClick={solve} disabled={loading || !question.trim()}>{loading ? 'Solving...' : 'Solve'}</button>
      </div>
    </div>
  )
}

export default InputScreen
