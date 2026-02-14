import React from 'react'

export interface ResultScreenProps {
  data: any
  onBack?: () => void
}

export function ResultScreen({ data, onBack }: ResultScreenProps) {
  if (!data) return null

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
