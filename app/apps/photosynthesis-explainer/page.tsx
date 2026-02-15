"use client"

import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'

const App = dynamic(() => import('../../../app-factory/generated-apps/photosynthesis-explainer/onboarding/App'), { ssr: false })

export default function PhotosynthesisExplainerPage() {
  return (
    <Suspense fallback={<div>Loading Photosynthesis Explainer…</div>}>
      <App />
    </Suspense>
  )
}
