"use client"

import React from 'react'

export function ResultScreen({ result }: { result: any }) {
  if (!result?.success) return <div>Something went wrong.</div>

  return (
    <div style={{ marginTop: 16 }}>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result.data, null, 2)}</pre>
    </div>
  )
}

export default ResultScreen
