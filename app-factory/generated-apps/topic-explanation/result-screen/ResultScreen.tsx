"use client"

import React from 'react'

export function ResultScreen({ data, onBack }: { data: any; onBack: () => void }) {
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
