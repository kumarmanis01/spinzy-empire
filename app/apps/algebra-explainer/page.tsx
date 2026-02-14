"use client"

import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'

const App = dynamic(() => import('../../app-factory/generated-apps/algebra-explainer/onboarding/App'), { ssr: false })

export default function AlgebraExplainerPage() {
  return (
    <Suspense fallback={<div>Loading Algebra Explainer…</div>}>
      <App />
    </Suspense>
  )
}
