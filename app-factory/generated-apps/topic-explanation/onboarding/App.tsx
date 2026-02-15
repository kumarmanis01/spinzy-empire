import React, { useState } from 'react';
import { InputScreen } from '../input-screen/InputScreen';
import { ResultScreen } from '../result-screen/ResultScreen';
import { Progress } from '../progress/Progress';

export default function TopicExplanationApp({ initialQuery }: { initialQuery?: string }) {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<any>(null);

  function handleResult(data: any) {
    setResult(data);
    setStep(2);
  }

  function back() {
    setStep(1);
    setResult(null);
  }

  return (
    <div style={{ padding: 12, border: '1px solid #ddd' }}>
      <h3>Topic Explanation</h3>
      <Progress step={step} total={2} />
      {step === 1 && <InputScreen onResult={handleResult} initialQuery={initialQuery} />}
      {step === 2 && <ResultScreen data={result} onBack={back} />}
    </div>
  );
}
