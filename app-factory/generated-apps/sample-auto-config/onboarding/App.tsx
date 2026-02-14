import React, { useState } from 'react';
import { InputScreen } from '../input-screen/InputScreen';
import { ResultScreen } from '../result-screen/ResultScreen';
import { Progress } from '../progress/Progress';

export default function App() {
  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState(1);

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
      {result && <ResultScreen result={result} />}
    </div>
  );
}
