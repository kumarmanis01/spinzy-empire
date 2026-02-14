import React, { useState } from 'react';
import { InputScreen } from '../input-screen/InputScreen';
import { ResultScreen } from '../result-screen/ResultScreen';
import { Progress } from '../progress/Progress';

export default function PhotosynthesisExplainerApp() {
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
      <h3>Photosynthesis Explainer</h3>
      <Progress step={step} total={2} />
      {step === 1 && <InputScreen onResult={handleResult} />}
      {step === 2 && <ResultScreen data={result} onBack={back} />}
    </div>
  );
}
