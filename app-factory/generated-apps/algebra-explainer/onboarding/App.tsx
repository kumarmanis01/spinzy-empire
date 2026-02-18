"use client"

import React from 'react'
import config from '../../../app-config/algebra-explainer.json'
import { InputScreen } from '../input-screen/InputScreen'
import { ResultScreen } from '../result-screen/ResultScreen'

export default function App({ currentSlug }: { currentSlug?: string }) {
  const [result, setResult] = React.useState<any>(null)

  return (
    <div style={{ padding: 24 }}>
      <h2>{config.title || 'algebra-explainer'}</h2>

      {!result ? (
        <InputScreen onResult={setResult} />
      ) : (
        <ResultScreen result={result} currentSlug={currentSlug} />
      )}
    </div>
  )
}
