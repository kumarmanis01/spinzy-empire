"use client"

import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const App = dynamic(() => import('../../../app-factory/generated-apps/topic-explanation/onboarding/App'), { ssr: false })

export default function TopicExplanationPage() {
  const searchParams = useSearchParams()
  const q = searchParams?.get('q') ?? undefined

  return (
    <Suspense fallback={<div>Loading Topic Explanation…</div>}>
      <App initialQuery={q} />
    </Suspense>
  )
}
