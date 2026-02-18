"use client"

import React from 'react'
import config from '../../../app-config/${APP_NAME}.json'
import { InputScreen } from '../input-screen/InputScreen'
import { ResultScreen } from '../result-screen/ResultScreen'

export default function App({ currentSlug }: { currentSlug?: string }) {
  const [result, setResult] = React.useState<any>(null)

  return (
    <div style={{ padding: 24 }}>
      <h2>{config.title || '${APP_NAME}'}</h2>

      {!result ? (
        <InputScreen onResult={setResult} />
      ) : (
        <ResultScreen result={result} currentSlug={currentSlug} />
      )}
    </div>
  )
}
