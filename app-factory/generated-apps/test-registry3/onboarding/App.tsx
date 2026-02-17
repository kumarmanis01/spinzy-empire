"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { InputScreen } from '../input-screen/InputScreen';
import { ResultScreen } from '../result-screen/ResultScreen';
import { Progress } from '../progress/Progress';

export default function App({ currentSlug }: { currentSlug?: string }) {
  const params = useParams();
  const derived = (params?.slug as string) || currentSlug;

  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState(1);

  // Debugging — ensure slug flows correctly
  try {
    // eslint-disable-next-line no-console
    console.log('Onboarding App currentSlug (prop):', currentSlug);
    // eslint-disable-next-line no-console
    console.log('Onboarding App currentSlug (derived):', derived);
  } catch {}

  return (
    <div>
      <h2>Micro App (Onboarding Template)</h2>
      <Progress step={step} />
      <InputScreen
        onResult={(res) => {
          setResult(res);
          setStep(2);
        }}
      />
      {result && <ResultScreen result={result} currentSlug={derived} />}
    </div>
  );
}
