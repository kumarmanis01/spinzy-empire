import React, { useState } from 'react'
import { callCapability } from '../services/capabilityClient'
import config from '../../../app-config/sample-auto-config.json'

export interface InputScreenProps {
  onResult: (data: any) => void
}

export function InputScreen({ onResult }: InputScreenProps) {
  const [capability, setCapability] = useState<string>(config.capability || 'study_planning')
  const [payload, setPayload] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    setLoading(true)
    try {
      const parsed = payload ? JSON.parse(payload) : {}
      const res = await callCapability(capability, parsed)
      onResult(res)
    } catch (err) {
      onResult({ success: false, error: 'invalid payload' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3>Input</h3>
      <div>
        <label>Capability: </label>
        <select value={capability} onChange={(e) => setCapability(e.target.value)}>
          <option value={config.capability || 'study_planning'}>{config.capability || 'study_planning'}</option>
        </select>
      </div>
      <div>
        <label>Payload (JSON):</label>
        <textarea value={payload} onChange={(e) => setPayload(e.target.value)} rows={6} cols={60} />
      </div>
      <div>
        <button onClick={submit} disabled={loading}>{loading ? 'Calling...' : 'Call Capability'}</button>
      </div>
    </div>
  )
}

export default InputScreen
