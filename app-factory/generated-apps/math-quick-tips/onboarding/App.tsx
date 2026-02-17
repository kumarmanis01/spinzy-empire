"use client"

import React from 'react'
import config from '../../../app-config/math-quick-tips.json'
import { InputScreen } from '../input-screen/InputScreen'
import { ResultScreen } from '../result-screen/ResultScreen'

export default function App({ currentSlug }: { currentSlug?: string }) {
  const [result, setResult] = React.useState<any>(null)

  return (
    <div>
      <h2>{config.title || 'math-quick-tips'}</h2>

      {!result ? (
        <InputScreen onResult={setResult} />
      ) : (
        <ResultScreen result={result} currentSlug={currentSlug} />
      )}
    </div>
  )
}
